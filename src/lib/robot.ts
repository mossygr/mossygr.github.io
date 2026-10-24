import labels from '../data/robot/en-labels.json';
import wires from '../data/robot/wires.json';
const dictionary:Record<string,string>=labels;
const decode=(s:string)=>s.replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#([0-9]+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;|&#x27;/g,"'");
const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function translateRobot(html:string,lang:string){
 if(lang!=='en')return html;
 return html.replace(/>([^<>]+)</g,(_all,text:string)=>{
  const decoded=decode(text),trim=decoded.trim(),translated=dictionary[trim];
  return `>${translated?escape(decoded.replace(trim,translated)):text}<`;
 }).replace(/aria-label="([^"]+)"/g,(_all,label:string)=>`aria-label="${escape(dictionary[decode(label)]||decode(label))}"`);
}
export function wireData(lang:string){
 return Object.fromEntries(Object.entries(wires).map(([id,data])=>[id,Object.fromEntries(Object.entries(data).map(([key,value])=>[key,lang==='en'?(dictionary[value]||value):value]))]));
}
