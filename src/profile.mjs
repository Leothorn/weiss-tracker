import {questions} from './questionnaire.mjs';

export const DEFAULT_PROFILE={works:true,studies:true,drives:true,ageGroup:'undisclosed',sexualQuestions:true};

export function validProfile(profile){
 return !!profile&&typeof profile.works==='boolean'&&typeof profile.studies==='boolean'&&typeof profile.drives==='boolean'&&
  ['under18','adult','undisclosed'].includes(profile.ageGroup)&&typeof profile.sexualQuestions==='boolean';
}

export function skippedQuestionIds(profile){
 if(!validProfile(profile))return [];
 return questions.filter(question=>
  (!profile.works&&question.domain==='B')||
  (!profile.studies&&question.domain==='C')||
  (!profile.drives&&['G1','G2','G3'].includes(question.id))||
  (!profile.sexualQuestions&&['D6','G11','G12'].includes(question.id))
 ).map(question=>question.id);
}

export function visibleQuestions(profile){
 const skipped=new Set(skippedQuestionIds(profile));
 return questions.filter(question=>!skipped.has(question.id));
}

export function answersForProfile(answers,profile){
 const result={...answers};
 for(const id of skippedQuestionIds(profile))result[id]='na';
 return result;
}
