import test from 'node:test';
import assert from 'node:assert/strict';
import {nextCalendarOccurrence,googleCalendarUrl} from '../src/calendar-reminder.mjs';

test('Google Calendar link opens a recurring monthly event at the next local occurrence',()=>{
 const schedule={day:28,hour:19,minute:30};
 const now=new Date(2026,1,28,19,31);
 const next=nextCalendarOccurrence(schedule,now);
 assert.equal(next.getMonth(),2);
 assert.equal(next.getDate(),28);
 const url=new URL(googleCalendarUrl(schedule,now,'Asia/Kolkata'));
 assert.equal(url.origin,'https://calendar.google.com');
 assert.equal(url.searchParams.get('action'),'TEMPLATE');
 assert.equal(url.searchParams.get('dates'),'20260328T193000/20260328T194500');
 assert.equal(url.searchParams.get('ctz'),'Asia/Kolkata');
 assert.equal(url.searchParams.get('recur'),'RRULE:FREQ=MONTHLY;BYMONTHDAY=28');
 assert.ok(!url.search.includes('answers'));
});

test('calendar reminder rejects invalid monthly dates',()=>{
 assert.throws(()=>googleCalendarUrl({day:31,hour:19,minute:0}),/Choose a day/);
});
