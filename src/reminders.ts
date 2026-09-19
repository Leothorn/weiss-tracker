import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import {REMINDER_ID,reminderRequest,validSchedule} from './reminder-model.mjs';
export type Schedule={day:number;hour:number;minute:number};
export type ReminderState={schedule:Schedule|null;allowed:boolean;next:number|null};
export const supported=true;
Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})});
function permitted(p:Notifications.NotificationPermissionsStatus){return p.granted || p.ios?.status===Notifications.IosAuthorizationStatus.PROVISIONAL || p.ios?.status===Notifications.IosAuthorizationStatus.EPHEMERAL;}
export async function readReminder():Promise<ReminderState>{
  const [requests,permission]=await Promise.all([Notifications.getAllScheduledNotificationsAsync(),Notifications.getPermissionsAsync()]);
  const stored=requests.find(r=>r.identifier===REMINDER_ID)?.content.data.schedule;
  const schedule=validSchedule(stored)?stored as Schedule:null;
  const channel=Platform.OS==='android'?await Notifications.getNotificationChannelAsync('check-ins'):null;
  const allowed=permitted(permission) && channel?.importance!==Notifications.AndroidImportance.NONE;
  const next=schedule?await Notifications.getNextTriggerDateAsync(reminderRequest(schedule).trigger as Notifications.MonthlyTriggerInput):null;
  return {schedule,allowed,next};
}
export async function enableReminder(schedule:Schedule){
  const request=reminderRequest(schedule);
  if(Platform.OS==='android')await Notifications.setNotificationChannelAsync('check-ins',{name:'Monthly check-ins',importance:Notifications.AndroidImportance.DEFAULT,lockscreenVisibility:Notifications.AndroidNotificationVisibility.PRIVATE,sound:'default'});
  let permission=await Notifications.getPermissionsAsync();
  if(!permitted(permission)&&permission.canAskAgain)permission=await Notifications.requestPermissionsAsync({ios:{allowAlert:true,allowSound:true,allowBadge:false}});
  if(!permitted(permission))throw Error('Notifications are blocked. Allow notifications in your device settings, then try again.');
  // The same identifier replaces the existing request; never accumulate reminders.
  await Notifications.scheduleNotificationAsync({...request,trigger:request.trigger as Notifications.MonthlyTriggerInput});
  const result=await readReminder();
  if(!result.schedule)throw Error('The device did not retain this reminder. Please try again.');
  return result;
}
export async function disableReminder(){await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);return readReminder();}
export function onReminderOpened(callback:()=>void){
  let active=true;const seen=new Set<string>();
  const handle=(response:Notifications.NotificationResponse|null)=>{
    if(!active||response?.notification.request.content.data.kind!==REMINDER_ID)return;
    const key=`${response.notification.request.identifier}:${response.notification.date}`;
    if(seen.has(key))return;seen.add(key);callback();
    void Notifications.clearLastNotificationResponseAsync().catch(()=>{});
  };
  const subscription=Notifications.addNotificationResponseReceivedListener(handle);
  void Notifications.getLastNotificationResponseAsync().then(handle).catch(()=>{});
  return ()=>{active=false;subscription.remove();};
}
