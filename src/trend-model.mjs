export function trendPositions(entries){
 const times=entries.map(entry=>Date.parse(entry.date));
 const first=Math.min(...times),last=Math.max(...times);
 return entries.map((entry,index)=>({
  x:entries.length===1?.5:last>first?(times[index]-first)/(last-first):index/(entries.length-1),
  y:entry.mean===null?null:(3-entry.mean)/3,
 }));
}
