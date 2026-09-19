import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import type {Profile} from './storage';
import {visibleQuestions, skippedQuestionIds} from './profile.mjs';

type Props = {value:Profile; onChange:(value:Profile)=>void; onContinue:()=>void; onCancel:()=>void; busy:boolean};

export default function ProfileSetup({value,onChange,onContinue,onCancel,busy}:Props){
 const update=<K extends keyof Profile>(key:K, choice:Profile[K])=>onChange({...value,[key]:choice});
 const field=(title:string,description:string,key:'works'|'studies'|'drives'|'sexualQuestions')=><View style={s.field} key={key}>
  <Text style={s.heading}>{title}</Text><Text style={s.muted}>{description}</Text>
  <View style={s.row}>{[{label:'Yes',answer:true},{label:'No',answer:false}].map(option=><Pressable key={option.label} accessibilityRole="radio" accessibilityLabel={`${title}: ${option.label}`} accessibilityState={{checked:value[key]===option.answer}} onPress={()=>update(key,option.answer)} style={[s.choice,value[key]===option.answer&&s.selected]}><Text style={[s.choiceText,value[key]===option.answer&&s.selectedText]}>{option.label}</Text></Pressable>)}</View>
 </View>;
 const count=visibleQuestions(value).length,skipped=skippedQuestionIds(value).length;
 return <>
  <Text style={s.eyebrow}>BEFORE THE QUESTIONS</Text>
  <Text accessibilityRole="header" style={s.title}>Make this check-in yours.</Text>
  <Text style={s.muted}>Choose what applied during the last month. You can change these choices at the next check-in. They stay on this device with your answers.</Text>
  {field('Did you work?','Includes paid work and other regular work responsibilities. If not, the Work section is skipped.','works')}
  {field('Did you attend school or college?','If not, the School section is skipped.','studies')}
  {field('Did you drive?','If not, three driving-related questions are skipped.','drives')}
  <View style={s.field}><Text style={s.heading}>Age group</Text><Text style={s.muted}>No birth date is needed. Age does not automatically hide any questions.</Text><View style={s.row}>{[{label:'Under 18',answer:'under18'},{label:'18 or older',answer:'adult'},{label:'Prefer not to say',answer:'undisclosed'}].map(option=><Pressable key={option.answer} accessibilityRole="radio" accessibilityLabel={`Age group: ${option.label}`} accessibilityState={{checked:value.ageGroup===option.answer}} onPress={()=>update('ageGroup',option.answer as Profile['ageGroup'])} style={[s.choice,value.ageGroup===option.answer&&s.selected]}><Text style={[s.choiceText,value.ageGroup===option.answer&&s.selectedText]}>{option.label}</Text></Pressable>)}</View></View>
  {field('Include sexual-topic questions?','Three items about sex or sexual behaviour. Choose for yourself, regardless of age. If No, they are skipped.','sexualQuestions')}
  <View style={s.note}><Text style={s.heading}>{count} questions this time</Text><Text style={s.muted}>{skipped} skipped items will be marked N/A and excluded from averages. Each saved check-in keeps these choices for context.</Text></View>
  <Pressable accessibilityRole="button" disabled={busy} onPress={onContinue} style={s.button}><Text style={s.buttonText}>{busy?'Saving…':'Continue to questions'}</Text></Pressable>
  <Pressable accessibilityRole="button" disabled={busy} onPress={onCancel} style={s.quiet}><Text style={s.quietText}>Not now</Text></Pressable>
 </>;
}

const s=StyleSheet.create({eyebrow:{fontSize:10,fontWeight:'700',letterSpacing:1.8,color:'#5B7A6B'},title:{fontSize:36,lineHeight:42,fontWeight:'600',color:'#203D36'},heading:{fontSize:18,lineHeight:25,fontWeight:'600',color:'#203D36'},muted:{fontSize:14,lineHeight:22,color:'#637368'},field:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E4E9DF',borderRadius:20,padding:20,gap:12},row:{flexDirection:'row',flexWrap:'wrap',gap:8},choice:{paddingVertical:12,paddingHorizontal:16,borderRadius:12,borderWidth:1,borderColor:'#DDE5D9',backgroundColor:'#FFFFFF'},selected:{backgroundColor:'#24665D',borderColor:'#24665D'},choiceText:{fontSize:14,color:'#2F473C'},selectedText:{color:'#FFFFFF',fontWeight:'600'},note:{backgroundColor:'#E7EEE3',borderRadius:16,padding:18,gap:8},button:{paddingVertical:16,paddingHorizontal:20,borderRadius:14,backgroundColor:'#24665D',alignItems:'center'},buttonText:{fontSize:14,fontWeight:'600',color:'white'},quiet:{paddingVertical:16,paddingHorizontal:20,borderRadius:14,backgroundColor:'#E7EEE3',alignItems:'center'},quietText:{fontSize:14,fontWeight:'600',color:'#24665D'}});
