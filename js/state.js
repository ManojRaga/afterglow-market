import {MISSIONS} from './content.js';
import {initial} from './math.js';
const KEY='afterglow-market-v1';
export function validDraft(m,v){if(!v||typeof v!=='object')return false;const integer=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;if(m.type==='mix')return integer(v.fruit,600)&&integer(v.water,600)&&v.fruit%10===0&&v.water%10===0;if(m.type==='price')return integer(v.markup,100)&&integer(v.discount,60)&&v.markup%5===0&&v.discount%5===0;if(m.type==='supply')return Array.isArray(v.counts)&&v.counts.length===m.offers.length&&v.counts.every((n,i)=>integer(n,m.offers[i].stock??12));return Array.isArray(v.cards)&&v.cards.length<=m.years&&v.cards.every(n=>integer(n,m.cards.length-1));}
export function createStore(storage){let persistent=!!storage,data={done:{},drafts:{},sound:false};try{const s=JSON.parse(storage?.getItem(KEY)||'null');if(s){data.sound=s.sound===true;for(const m of MISSIONS){if(validDraft(m,s.drafts?.[m.id]))data.drafts[m.id]=s.drafts[m.id];if(s.done?.[m.id]===true)data.done[m.id]=true;}}}catch{persistent=false;}
 const save=()=>{try{if(!storage)throw Error();storage.setItem(KEY,JSON.stringify(data));}catch{persistent=false;}};
 return {done:id=>data.done[id]===true,count:()=>Object.keys(data.done).length,nightDone:n=>MISSIONS.filter(m=>m.night===n).every(m=>data.done[m.id]),unlocked:n=>n===0||MISSIONS.filter(m=>m.night<n).every(m=>data.done[m.id]),draft:m=>structuredClone(data.drafts[m.id]||initial(m)),setDraft(m,v){if(validDraft(m,v)){data.drafts[m.id]=structuredClone(v);save();}},finish(m,v){data.done[m.id]=true;data.drafts[m.id]=structuredClone(v);save();},sound:()=>data.sound,toggleSound(){data.sound=!data.sound;save();return data.sound;},persistent:()=>persistent,reset(){data={done:{},drafts:{},sound:data.sound};save();}};
}
let storage;try{storage=globalThis.localStorage;}catch{}
export const store=createStore(storage);
