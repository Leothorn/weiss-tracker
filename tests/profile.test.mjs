import test from 'node:test';
import assert from 'node:assert/strict';
import {complete,score} from '../src/questionnaire.mjs';
import {DEFAULT_PROFILE,validProfile,skippedQuestionIds,visibleQuestions,answersForProfile} from '../src/profile.mjs';

test('profile skips only the agreed Work, School, and driving items',()=>{
 const profile={...DEFAULT_PROFILE,works:false,studies:false,drives:false};
 const skipped=skippedQuestionIds(profile);
 assert.equal(skipped.length,24);
 assert.equal(visibleQuestions(profile).length,45);
 assert.ok(skipped.includes('B1')&&skipped.includes('B11'));
 assert.ok(skipped.includes('C1')&&skipped.includes('C10'));
 assert.ok(skipped.includes('G1')&&skipped.includes('G2')&&skipped.includes('G3'));
 assert.ok(!skipped.includes('G4'));
 assert.equal(visibleQuestions(DEFAULT_PROFILE).length,69);
});

test('skipped items become N/A, never zero, and are excluded from means',()=>{
 const profile={...DEFAULT_PROFILE,works:false,studies:false,drives:false};
 const manual=Object.fromEntries(visibleQuestions(profile).map(q=>[q.id,2]));
 const answers=answersForProfile(manual,profile);
 assert.ok(complete(answers));
 assert.equal(answers.B1,'na');
 assert.equal(score(answers,'B').mean,null);
 assert.equal(score(answers,'C').mean,null);
 assert.equal(score(answers).count,45);
 assert.equal(score(answers).mean,2);
 assert.equal(manual.B1,undefined);
});

test('changing profile does not erase earlier draft answers',()=>{
 const draft={B1:3,G1:1,A1:0};
 const reduced=answersForProfile(draft,{...DEFAULT_PROFILE,works:false,drives:false});
 assert.equal(reduced.B1,'na');
 assert.equal(reduced.G1,'na');
 assert.equal(draft.B1,3);
 assert.equal(draft.G1,1);
 assert.equal(visibleQuestions(DEFAULT_PROFILE).find(q=>q.id==='B1')?.id,'B1');
 assert.equal(validProfile({...DEFAULT_PROFILE,studies:false}),true);
 assert.equal(validProfile({...DEFAULT_PROFILE,works:'no'}),false);
});

test('sexual-topic questions are an explicit choice independent of age',()=>{
 const under18={...DEFAULT_PROFILE,ageGroup:'under18'};
 assert.equal(skippedQuestionIds(under18).length,0);
 const optedOut={...under18,sexualQuestions:false};
 assert.deepEqual(skippedQuestionIds(optedOut),['D6','G11','G12']);
 assert.equal(visibleQuestions(optedOut).length,66);
 assert.equal(skippedQuestionIds({...optedOut,ageGroup:'adult'}).length,3);
});
