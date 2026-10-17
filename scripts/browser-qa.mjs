import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {MISSIONS,STATIONS,NIGHTS} from '../www/js/content.js';
const arg=n=>process.argv.find(a=>a.startsWith(`--${n}=`))?.slice(n.length+3);
const{chromium}=await import(arg('playwright')||'playwright');
const browser=await chromium.launch({headless:true,...(arg('chromium')?{executablePath:arg('chromium')}:{})});
const base=arg('url')||'http://localhost:8180/',width=Number(arg('width'))||390;
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));await mkdir('test-results',{recursive:true});
const click=name=>page.getByRole('button',{name,exact:true}).click();
const shot=name=>page.screenshot({path:`test-results/${name}-${width}.png`,fullPage:true});
async function noOverflow(){const r=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('main *,header *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.className?.baseVal??e.className).slice(0,10)}));assert.ok(r.scroll<=r.width+1,JSON.stringify(r));}
async function dial(label,value){const s=page.getByRole('slider',{name:label,exact:true});await s.focus();await s.press('Home');for(let n=0;n<value;n+=5)await s.press('ArrowRight');assert.equal(await s.inputValue(),String(value));}
async function solve(m){if(m.type==='mix'){await click('Empty the jug');await page.getByLabel('Pour size',{exact:true}).selectOption('50');for(const k of ['fruit','water'])for(let n=0;n<Math.floor(m.answer[k]/50);n++)await click(`Pour ${k}`);await page.getByLabel('Pour size',{exact:true}).selectOption('10');for(const k of ['fruit','water'])for(let n=0;n<m.answer[k]%50;n+=10)await click(`Pour ${k}`);}
 if(m.type==='price'){await dial('Markup on cost',m.id==='price-1'?60:m.answer.markup);await dial('Discount on marked price',m.id==='price-1'?25:m.answer.discount);}
 if(m.type==='supply')for(const[i,n]of m.answer.counts.entries())for(let j=0;j<n;j++)await click(`Add ${m.offers[i].name}`);
 if(m.type==='growth'){await click('Clear plan');for(const i of m.answer.cards)await click(m.cards[i].label);}
 await click({mix:'Serve the pitcher',price:'Print the price tag',supply:'Place the order',growth:'Run the seasons'}[m.type]);await page.locator('.notice.success').waitFor();
}
try{
 await page.goto(base);await page.getByRole('heading',{name:'The night is yours.',exact:true}).waitFor();await noOverflow();await shot('desktop-market');
 assert.equal(await page.locator('.night-selector button:disabled').count(),3);await page.setViewportSize({width,height:900});await shot('phone-market');await noOverflow();
 await click('Visit Moonfruit');await click('Serve the pitcher');await page.locator('.try-again').waitFor();assert.equal(await page.locator('.light-count').getAttribute('aria-label'),'0 of 16 lanterns lit');
 await click('Pour fruit');await page.reload();assert.ok((await page.locator('.fruit-stat').innerText()).includes('10'));await click('← Market');
 const rounds=process.argv.includes('--full')?MISSIONS:MISSIONS.slice(0,4);
 for(const m of rounds){
  if(m.type==='mix'&&m.night>0)await click(`Open night ${m.night+1} →`);
  const station=STATIONS.find(s=>s.id===m.type);await click(`Visit ${station.name}`);await page.getByRole('heading',{name:m.title,exact:true}).waitFor();await noOverflow();
  if(m.night===0)await shot(`station-${m.type}`);
  if(m.id==='growth-3'){assert.equal(await page.getByRole('button',{name:'Grow 20%',exact:true}).isDisabled(),true);}
  await solve(m);await noOverflow();if(m.night===1||m.id==='growth-3')await shot(`solved-${m.id}`);
  await click('Return to the market →');
  assert.equal(await page.locator('.light-count').getAttribute('aria-label'),`${rounds.indexOf(m)+1} of 16 lanterns lit`);
  console.log(`✓ ${m.id}`);
 }
 if(process.argv.includes('--full')){await page.getByRole('heading',{name:'Look what you brought to life.',exact:true}).waitFor();assert.equal(await page.locator('.market-bulb.lit').count(),16);await shot('all-lanterns');await page.locator('.night-selector button').nth(0).click();await click('Visit Moonfruit');await page.reload();await page.getByRole('heading',{name:'The first pitcher',exact:true}).waitFor();await solve(MISSIONS[0]);assert.ok((await page.locator('.success').innerText()).includes('A good plan, again.'));assert.equal(await page.locator('.light-count').getAttribute('aria-label'),'16 of 16 lanterns lit');await click('Return to the market →');}
 await click('Enter free play');await page.locator('.night-selector button').nth(3).click();await click('Visit Tag & Twine');await dial('Markup on cost',100);await dial('Discount on marked price',0);await click('Review experiment');await page.locator('.success').waitFor();assert.ok((await page.locator('.success').innerText()).includes('₹500'));assert.equal(await page.locator('.light-count').getAttribute('aria-label'),`${rounds.length} of 16 lanterns lit`);await click('Back to the market');await click('Leave free play');
 await click('Notebook');assert.equal(await page.locator('.notes-grid article').count(),8);await noOverflow();await shot('notebook');
 const scope=await page.evaluate(async()=>(await navigator.serviceWorker.ready).scope);assert.equal(scope,new URL('./',base).href);
 await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'Keep the good ideas.',exact:true}).waitFor();await click('Market');await click('Visit Moonfruit');await page.locator('.jug').waitFor();await context.setOffline(false);console.log('✓ Offline reload, notebook and machines');
 for(const w of [320,768,1440]){await page.setViewportSize({width:w,height:1000});await click('Market');await noOverflow();await shot(`layout-${w}`);await click('Visit Tomorrow garden');await noOverflow();await click('← Market');}
 await click('Game settings');await page.getByLabel('Classroom access').check();await click('Back to the market');await page.locator('.teacher-banner').waitFor();assert.equal(await page.locator('.night-selector button:disabled').count(),0);
 await click('Game settings');await click('Reset market progress');await click('Keep my market');await click('Close settings');assert.equal(await page.locator('.light-count').getAttribute('aria-label'),`${rounds.length} of 16 lanterns lit`);
 await click('Enable sound');await page.reload();await page.getByRole('button',{name:'Mute sound',exact:true}).waitFor();await click('Game settings');await click('Reset market progress');await click('Yes, reset');assert.equal(await page.locator('.light-count').getAttribute('aria-label'),'0 of 16 lanterns lit');assert.equal(await page.locator('.night-selector button:disabled').count(),3);
 assert.deepEqual(errors,[]);console.log('✓ Responsive layouts, free play, classroom access, persistent controls, sound, reset and zero browser errors');
}catch(e){console.error('Runtime errors:',errors);console.error(await page.locator('body').innerText());await shot('failure');throw e;}finally{await browser.close();}
