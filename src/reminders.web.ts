import type {Schedule,ReminderState} from './reminders';
export const supported=false;
export async function readReminder():Promise<ReminderState>{return {schedule:null,allowed:false,next:null};}
export async function enableReminder(_schedule:Schedule):Promise<ReminderState>{throw Error('Scheduled reminders are available in the Android and iOS apps.');}
export async function disableReminder(){return readReminder();}
export function onReminderOpened(_callback:()=>void){return ()=>{};}
