import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { validRecord } from './questionnaire.mjs';
export type Answer = 0|1|2|3|'na';
export type Answers = Record<string,Answer>;
export type Assessment = {id:string;date:string;version:1;answers:Answers};
const INDEX='weiss_index_v1', DRAFT='weiss_draft_v1';
async function get(key:string) {return Platform.OS==='web'?localStorage.getItem(key):SecureStore.getItemAsync(key);}
async function set(key:string,value:string) {if(Platform.OS==='web')localStorage.setItem(key,value);else await SecureStore.setItemAsync(key,value,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});}
async function remove(key:string) {if(Platform.OS==='web')localStorage.removeItem(key);else await SecureStore.deleteItemAsync(key);}
async function ids():Promise<string[]> {const value=JSON.parse(await get(INDEX)??'[]');if(!Array.isArray(value)||value.some(x=>typeof x!=='string'))throw Error('Invalid history index');return value;}
export async function loadRecords():Promise<Assessment[]> {const records=await Promise.all((await ids()).map(async id=>{const r=JSON.parse(await get('weiss_'+id)??'null');if(!validRecord(r))throw Error('A saved assessment could not be read.');return r;}));return records.sort((a,b)=>b.date.localeCompare(a.date));}
export async function saveRecord(record:Assessment) {if(!validRecord(record))throw Error('Incomplete assessment');const index=await ids();await set('weiss_'+record.id,JSON.stringify(record));await set(INDEX,JSON.stringify([...new Set([...index,record.id])]));}
export async function deleteRecord(id:string) {await set(INDEX,JSON.stringify((await ids()).filter(x=>x!==id)));await remove('weiss_'+id);}
export async function loadDraft():Promise<Answers> {const value=JSON.parse(await get(DRAFT)??'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid draft');return value;}
export async function saveDraft(answers:Answers) {await set(DRAFT,JSON.stringify(answers));}
