export function el(tag,attrs={},...children){const n=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(k.startsWith('on'))n.addEventListener(k.slice(2),v);else if(v!==false&&v!=null)n.setAttribute(k,v===true?'':v);}for(const c of children.flat(Infinity)){if(c!=null&&c!==false)n.append(c instanceof Node?c:document.createTextNode(String(c)));}return n;}
export const button=(label,action,cls='',attrs={})=>el('button',{type:'button',class:cls,onclick:action,...attrs},label);
export const clear=(node,...children)=>node.replaceChildren(...children);
export const money=n=>'₹'+Number(n).toLocaleString('en-IN',{maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(Number(n))?0:2});
export const fmt=n=>Number(n.toFixed(2)).toLocaleString('en-IN');
export const icon=(text,cls='')=>el('span',{class:'symbol '+cls,'aria-hidden':'true'},text);
