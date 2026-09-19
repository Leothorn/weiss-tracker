import {validSchedule} from './reminder-model.mjs';

const pad=value=>String(value).padStart(2,'0');
const localStamp=date=>`${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;

export function nextCalendarOccurrence(schedule,now=new Date()){
 if(!validSchedule(schedule))throw Error('Choose a day from 1–28 and a valid 24-hour time.');
 let next=new Date(now.getFullYear(),now.getMonth(),schedule.day,schedule.hour,schedule.minute);
 if(next<=now)next=new Date(now.getFullYear(),now.getMonth()+1,schedule.day,schedule.hour,schedule.minute);
 return next;
}

export function googleCalendarUrl(schedule,now=new Date(),timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone){
 const start=nextCalendarOccurrence(schedule,now);
 const end=new Date(start.getTime()+15*60*1000);
 const params=new URLSearchParams({
  action:'TEMPLATE',
  text:'A moment for yourself',
  dates:`${localStamp(start)}/${localStamp(end)}`,
  ctz:timeZone,
  recur:`RRULE:FREQ=MONTHLY;BYMONTHDAY=${schedule.day}`,
  details:'Open https://leothorn.github.io/weiss-tracker/ to complete your monthly check-in.',
 });
 return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
