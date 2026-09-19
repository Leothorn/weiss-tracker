import React,{useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {domains,score} from './questionnaire.mjs';
import {trendPositions} from './trend-model.mjs';
import type {Assessment} from './storage';

type Props={records:Assessment[];metric:string;color:string;onSelect:(record:Assessment)=>void};
type Position={x:number;y:number|null};
const HEIGHT=236,LEFT=38,RIGHT=16,TOP=12,BOTTOM=34;
const formatDate=(value:string)=>new Date(value).toLocaleString(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
const formatShort=(value:string)=>new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric'});
const formatTime=(value:string)=>new Date(value).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});

export default function TrendChart({records,metric,color,onSelect}:Props){
 const [width,setWidth]=useState(0);
 const metricName=domains.find(domain=>domain.id===metric)?.name??'Overall';
 const chronological=[...records].reverse();
 const values=chronological.map(record=>({record,result:score(record.answers,metric||undefined)}));
 const sameDay=values.length>1&&new Date(values[0].record.date).toDateString()===new Date(values[values.length-1].record.date).toDateString();
 const positions:Position[]=trendPositions(values.map(v=>({date:v.record.date,mean:v.result.mean})));
 const chartWidth=Math.max(0,width-LEFT-RIGHT),chartHeight=HEIGHT-TOP-BOTTOM;
 const plotted=positions.map(point=>({x:LEFT+point.x*chartWidth,y:point.y===null?null:TOP+point.y*chartHeight}));
 return <View>
  <Text style={s.scaleNote}>Mean score · 0 to 3 · Higher means more reported difficulty</Text>
  <View onLayout={event=>setWidth(event.nativeEvent.layout.width)} style={s.chart} accessibilityLabel={`${metricName} scores over time`}>
   {width>0&&<>
    {[3,2,1,0].map(value=>{const y=TOP+(3-value)/3*chartHeight;return <React.Fragment key={value}><Text style={[s.axisLabel,{top:y-9}]}>{value}</Text><View style={[s.grid,{left:LEFT,right:RIGHT,top:y}]} /></React.Fragment>;})}
    {plotted.slice(1).map((point,index)=>{const previous=plotted[index];if(point.y===null||previous.y===null)return null;const dx=point.x-previous.x,dy=point.y-previous.y,length=Math.hypot(dx,dy);return <View key={`line-${index}`} style={[s.line,{backgroundColor:color,left:(point.x+previous.x-length)/2,top:(point.y+previous.y)/2-1,width:length,transform:[{rotate:`${Math.atan2(dy,dx)}rad`}]}]} />;})}
    {plotted.map((point,index)=>point.y===null?null:<Pressable key={values[index].record.id} accessibilityRole="button" accessibilityLabel={`${formatDate(values[index].record.date)}, mean ${values[index].result.mean?.toFixed(2)} out of 3, ${values[index].result.count} rated items. View assessment.`} onPress={()=>onSelect(values[index].record)} style={[s.hit,{left:point.x-15,top:point.y-15}]}><View style={[s.dot,{backgroundColor:color}]} /></Pressable>)}
    {values.length>0&&<Text style={[s.dateLabel,{left:LEFT,bottom:0}]}>{sameDay?formatTime(values[0].record.date):formatShort(values[0].record.date)}</Text>}
    {values.length>1&&<Text style={[s.dateLabel,{right:RIGHT,bottom:0,textAlign:'right'}]}>{sameDay?formatTime(values[values.length-1].record.date):formatShort(values[values.length-1].record.date)}</Text>}
   </>}
  </View>
  {values.length===1&&<Text style={s.note}>One check-in so far. A second will show the direction of change.</Text>}
  {values.some(v=>v.result.mean===null)&&<Text style={s.note}>A check-in with only N/A responses has no plotted mean.</Text>}
  <View style={s.list}>{values.map(({record,result})=><Pressable key={record.id} accessibilityRole="button" onPress={()=>onSelect(record)} style={s.row}><View style={{flex:1}}><Text style={s.date}>{formatDate(record.date)}</Text><Text style={s.count}>{result.count} rated · {result.na} N/A</Text></View><Text style={s.value}>{result.mean===null?'N/A':result.mean.toFixed(2)} / 3</Text></Pressable>)}</View>
  <Text style={s.note}>Tap a point or date to review that check-in. N/A answers are excluded from each mean.</Text>
 </View>;
}

const s=StyleSheet.create({chart:{height:HEIGHT,width:'100%',position:'relative',marginTop:12},scaleNote:{color:'#637368',fontSize:12,lineHeight:18},axisLabel:{position:'absolute',left:4,width:26,textAlign:'right',fontSize:11,color:'#738175'},grid:{position:'absolute',height:1,backgroundColor:'#E0E8DE'},line:{position:'absolute',height:2,borderRadius:2},hit:{position:'absolute',width:30,height:30,alignItems:'center',justifyContent:'center'},dot:{width:12,height:12,borderRadius:6,borderWidth:2,borderColor:'white'},dateLabel:{position:'absolute',fontSize:11,color:'#738175',maxWidth:100},list:{marginTop:16},row:{flexDirection:'row',alignItems:'center',gap:8,paddingVertical:10,borderBottomWidth:1,borderColor:'#EEF1E9'},date:{fontSize:13,color:'#2F473C'},value:{fontSize:13,fontWeight:'700',color:'#24665D'},count:{fontSize:11,color:'#738175',marginTop:3},note:{fontSize:12,lineHeight:18,color:'#738175',marginTop:10}});
