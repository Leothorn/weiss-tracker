export const domains = [
  {id:'A',name:'Family',items:[
    'Having problems with family','Having problems with spouse/partner','Relying on others to do things for you','Causing fighting in the family','Makes it hard for the family to have fun together','Problems taking care of your family','Problems balancing your needs against those of your family','Problems losing control with family']},
  {id:'B',name:'Work',items:[
    'Problems performing required duties','Problems with getting your work done efficiently','Problems with your supervisor','Problems keeping a job','Getting fired from work','Problems working in a team','Problems with your attendance','Problems with being late','Problems taking on new tasks','Problems working to your potential','Poor performance evaluations']},
  {id:'C',name:'School',items:[
    'Problems taking notes','Problems completing assignments','Problems getting your work done efficiently','Problems with teachers','Problems with school administrators','Problems meeting minimum requirements to stay in school','Problems with attendance','Problems with being late','Problems with working to your potential','Problems with inconsistent grades']},
  {id:'D',name:'Life skills',items:[
    'Excessive or inappropriate use of internet, video games or TV','Problems keeping an acceptable appearance','Problems getting ready to leave the house','Problems getting to bed','Problems with nutrition','Problems with sex','Problems with sleeping','Getting hurt or injured','Avoiding exercise','Problems keeping regular appointments with doctor/dentist','Problems keeping up with household chores','Problems managing money']},
  {id:'E',name:'Self-concept',items:[
    'Feeling bad about yourself','Feeling frustrated with yourself','Feeling discouraged','Not feeling happy with your life','Feeling incompetent']},
  {id:'F',name:'Social',items:[
    'Getting into arguments','Trouble cooperating','Trouble getting along with people','Problems having fun with other people','Problems participating in hobbies','Problems making friends','Problems keeping friends','Saying inappropriate things','Complaints from neighbours']},
  {id:'G',name:'Risk',items:[
    'Aggressive driving','Doing other things while driving','Road rage','Breaking or damaging things','Doing things that are illegal','Being involved with the police','Smoking cigarettes','Smoking marijuana','Drinking alcohol','Taking "street" drugs','Sex without protection (birth control, condom)','Sexually inappropriate behaviour','Being physically aggressive','Being verbally aggressive']}
];
export const questions = domains.flatMap(d=>d.items.map((text,i)=>({id:`${d.id}${i+1}`,domain:d.id,text})));
export const choices = [{value:0,label:'Never or not at all'},{value:1,label:'Sometimes or somewhat'},{value:2,label:'Often or much'},{value:3,label:'Very often or very much'},{value:'na',label:'Not applicable'}];
export function score(answers, domain) {
  const items = questions.filter(q=>!domain || q.domain===domain);
  const values = items.map(q=>answers[q.id]).filter(v=>Number.isInteger(v)&&v>=0&&v<=3);
  const total = values.reduce((s,v)=>s+v,0);
  return {total,mean:values.length?total/values.length:null,count:values.length,high:values.filter(v=>v>=2).length,na:items.filter(q=>answers[q.id]==='na').length};
}
export function complete(answers) {return questions.every(q=>choices.some(c=>c.value===answers[q.id]));}
export function validRecord(record) {return record && typeof record.id==='string' && typeof record.date==='string' && Number.isFinite(Date.parse(record.date)) && record.version===1 && record.answers && complete(record.answers);}
