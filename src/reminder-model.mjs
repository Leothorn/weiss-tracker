export const REMINDER_ID = 'weiss-monthly-check-in';
export const DEFAULT_REMINDER = {day:1,hour:19,minute:0};
export function validSchedule(value) {
  return !!value && Number.isInteger(value.day) && value.day>=1 && value.day<=28 &&
    Number.isInteger(value.hour) && value.hour>=0 && value.hour<=23 &&
    Number.isInteger(value.minute) && value.minute>=0 && value.minute<=59;
}
export function reminderRequest(schedule) {
  if (!validSchedule(schedule)) throw Error('Choose a day from 1–28 and a valid 24-hour time.');
  return {
    identifier:REMINDER_ID,
    content:{title:'A moment for yourself',body:'Your monthly check-in is ready. Take a few minutes to reflect.',sound:'default',data:{kind:REMINDER_ID,schedule}},
    trigger:{type:'monthly',channelId:'check-ins',...schedule},
  };
}
