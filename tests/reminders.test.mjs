import test from 'node:test';
import assert from 'node:assert/strict';
import {validSchedule,reminderRequest,REMINDER_ID} from '../src/reminder-model.mjs';
test('monthly schedule rejects missing, fractional and impossible values',()=>{for(const x of [null,{}, {day:29,hour:19,minute:0},{day:0,hour:19,minute:0},{day:1,hour:24,minute:0},{day:1,hour:19,minute:60},{day:1.5,hour:19,minute:0}])assert.equal(validSchedule(x),false);});
test('month-safe dates and midnight are valid',()=>{assert.ok(validSchedule({day:28,hour:0,minute:0}));assert.ok(validSchedule({day:1,hour:23,minute:59}));});
test('updates reuse identifier and contain no answer data',()=>{const first=reminderRequest({day:1,hour:19,minute:0}),second=reminderRequest({day:28,hour:8,minute:30});assert.equal(first.identifier,REMINDER_ID);assert.equal(first.identifier,second.identifier);assert.deepEqual(second.trigger,{type:'monthly',channelId:'check-ins',day:28,hour:8,minute:30});assert.deepEqual(Object.keys(second.content.data).sort(),['kind','schedule']);});
