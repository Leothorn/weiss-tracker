import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,domains,score,complete,validRecord} from '../src/questionnaire.mjs';
test('source has 69 unique items in seven domains',()=>{assert.equal(questions.length,69);assert.equal(new Set(questions.map(q=>q.id)).size,69);assert.deepEqual(domains.map(d=>d.items.length),[8,11,10,12,5,9,14]);});
test('N/A and missing answers do not inflate denominator',()=>{assert.deepEqual(score({A1:0,A2:2,A3:3,A4:'na'},'A'),{total:5,mean:5/3,count:3,high:2,na:1});});
test('no applicable answers produces no score',()=>{assert.equal(score({A1:'na'},'A').mean,null);});
test('complete requires explicit choice for every item',()=>{const answers=Object.fromEntries(questions.map(q=>[q.id,'na']));assert.ok(complete(answers));delete answers.G14;assert.equal(complete(answers),false);});
test('total mean is weighted by answered items',()=>{const a={A1:3,B1:0,B2:0,B3:0};assert.equal(score(a).mean,.75);});
test('stored records require version, time and complete responses',()=>{const r={id:'a',date:new Date().toISOString(),version:1,answers:Object.fromEntries(questions.map(q=>[q.id,0]))};assert.ok(validRecord(r));assert.equal(validRecord({...r,date:'bad'}),false);assert.equal(validRecord({...r,version:2}),false);});
