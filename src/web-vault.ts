import {validRecord} from './questionnaire.mjs';
import {validProfile} from './profile.mjs';
import type {Answers,Assessment,Profile} from './storage';

const DB_NAME='weiss_secure_v1';
const STORE='vault';
const LEGACY_INDEX='weiss_index_v1';
const LEGACY_DRAFT='weiss_draft_v1';
type Vault={records:Assessment[];draft:Answers;profile:Profile|null};
type Ciphertext={version:1;iv:number[];data:ArrayBuffer};

function request<T>(value:IDBRequest<T>):Promise<T>{return new Promise((resolve,reject)=>{value.onsuccess=()=>resolve(value.result);value.onerror=()=>reject(value.error);});}
function transactionDone(tx:IDBTransaction):Promise<void>{return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error??Error('Browser storage transaction failed'));});}
function openDatabase():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Close other tabs of this tracker and retry.'));});}
async function get<T>(db:IDBDatabase,id:string):Promise<T|undefined>{const tx=db.transaction(STORE,'readonly');const value=await request<T|undefined>(tx.objectStore(STORE).get(id));await transactionDone(tx);return value;}
async function put(db:IDBDatabase,id:string,value:unknown):Promise<void>{const tx=db.transaction(STORE,'readwrite');const done=transactionDone(tx);tx.objectStore(STORE).put(value,id);await done;}
function readLegacy():Vault{
 const rawIds=localStorage.getItem(LEGACY_INDEX);
 const ids=JSON.parse(rawIds??'[]');
 if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'))throw Error('Saved assessment index is invalid.');
 const records=ids.map(id=>{const record=JSON.parse(localStorage.getItem(`weiss_${id}`)??'null');if(!validRecord(record))throw Error('A saved assessment could not be migrated.');return record as Assessment;});
 const draft=JSON.parse(localStorage.getItem(LEGACY_DRAFT)??'{}');
 if(!draft||typeof draft!=='object'||Array.isArray(draft))throw Error('Saved draft is invalid.');
 return {records,draft,profile:null};
}
function clearLegacy(vault:Vault){localStorage.removeItem(LEGACY_INDEX);localStorage.removeItem(LEGACY_DRAFT);for(const record of vault.records)localStorage.removeItem(`weiss_${record.id}`);}
async function encrypt(key:CryptoKey,vault:Vault):Promise<Ciphertext>{const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(vault)));return {version:1,iv:Array.from(iv),data};}
async function decrypt(key:CryptoKey,value:Ciphertext):Promise<Vault>{if(value?.version!==1||!Array.isArray(value.iv)||value.iv.length!==12||!(value.data instanceof ArrayBuffer))throw Error('Encrypted browser data is invalid.');const bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(value.iv)},key,value.data);const vault=JSON.parse(new TextDecoder().decode(bytes));if(!vault||!Array.isArray(vault.records)||vault.records.some((r:unknown)=>!validRecord(r))||!vault.draft||typeof vault.draft!=='object'||Array.isArray(vault.draft)||(vault.profile!=null&&!validProfile(vault.profile)))throw Error('Encrypted browser data is invalid.');return {...vault,profile:vault.profile??null};}

let opening:Promise<{db:IDBDatabase;key:CryptoKey}>|undefined;
async function initialise(){
 if(!globalThis.indexedDB||!globalThis.crypto?.subtle)throw Error('This browser does not support encrypted storage.');
 const db=await openDatabase();
 let key=await get<CryptoKey>(db,'key');
 let ciphertext=await get<Ciphertext>(db,'data');
 if(key&&ciphertext){const vault=await decrypt(key,ciphertext);clearLegacy(vault);return {db,key};}
 if(ciphertext&&!key)throw Error('The browser encryption key is missing. Saved data cannot be opened.');
 const vault=readLegacy();
 key=key??await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 ciphertext=await encrypt(key,vault);
 // The key and encrypted data are committed together before plaintext is removed.
 const tx=db.transaction(STORE,'readwrite');const done=transactionDone(tx);tx.objectStore(STORE).put(key,'key');tx.objectStore(STORE).put(ciphertext,'data');await done;
 await decrypt(key,ciphertext);
 clearLegacy(vault);
 return {db,key};
}
async function connection(){if(!opening)opening=initialise().catch(error=>{opening=undefined;throw error;});return opening;}
let writes=Promise.resolve();
async function read():Promise<Vault>{await writes;const {db,key}=await connection();const value=await get<Ciphertext>(db,'data');if(!value)throw Error('Encrypted browser data is missing.');return decrypt(key,value);}
function update(change:(vault:Vault)=>void):Promise<void>{const result=writes.then(async()=>{const {db,key}=await connection();const stored=await get<Ciphertext>(db,'data');if(!stored)throw Error('Encrypted browser data is missing.');const vault=await decrypt(key,stored);change(vault);await put(db,'data',await encrypt(key,vault));});writes=result.catch(()=>{});return result;}
export async function loadWebRecords(){return (await read()).records.sort((a,b)=>b.date.localeCompare(a.date));}
export async function saveWebRecord(record:Assessment){await update(vault=>{vault.records=[...vault.records.filter(r=>r.id!==record.id),record];});}
export async function deleteWebRecord(id:string){await update(vault=>{vault.records=vault.records.filter(r=>r.id!==id);});}
export async function loadWebDraft(){return (await read()).draft;}
export async function saveWebDraft(answers:Answers){await update(vault=>{vault.draft=answers;});}
export async function loadWebProfile(){return (await read()).profile;}
export async function saveWebProfile(profile:Profile){await update(vault=>{vault.profile=profile;});}
