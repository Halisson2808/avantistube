import fs from 'node:fs';
import {createClient} from '@supabase/supabase-js';
const env=Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).map(l=>{const i=l.indexOf('='); return [l.slice(0,i),l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')];}));
const db=createClient(env.VITE_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
async function all(table,cols,filter){let out=[];for(;;){let q=db.from(table).select(cols,{count:'exact'}).order('id').range(out.length,out.length+999);if(filter)q=filter(q);const {data,error,count}=await q;if(error)throw new Error(table+': '+error.message);if(!data.length&&out.length<count)throw new Error('Incomplete '+table);out.push(...data);if(out.length>=count)break;}return out;}
const funnels=await all('quiz_funnels','id,funnel_key,name,version,site_key,status');
const sites=await all('tracking_sites','id,site_key,name,domain');
console.log(JSON.stringify({funnels,sites}));
const selected=funnels.filter(f=>/yuki/i.test(f.funnel_key+' '+f.name+' '+f.site_key));
const keys=[...new Set(['avo-yuki',...selected.map(f=>f.site_key).filter(Boolean),...sites.filter(s=>/yuki/i.test(s.site_key+' '+s.name+' '+s.domain)).map(s=>s.site_key)])];
const events=await all('tracking_events','id,site_key,event_name,event_type,path,visitor_id,session_id,created_at,meta,device,utm_source,utm_campaign',q=>q.in('site_key',keys));
const ids=selected.map(f=>f.id);
const attempts=await all('quiz_attempts','id,funnel_id,lead_id,visitor_id,session_id,quiz_version,result_key,started_at,completed_at,last_stage,last_stage_at',q=>q.in('funnel_id',ids));
const leads=await all('quiz_leads','id,funnel_id,created_at,last_stage,last_stage_at,status',q=>q.in('funnel_id',ids));
let answers=[];for(let i=0;i<attempts.length;i+=150)answers.push(...await all('quiz_answers','id,attempt_id,question_key,question_label,position,created_at',q=>q.in('attempt_id',attempts.slice(i,i+150).map(a=>a.id))));
fs.mkdirSync('reports/yuki',{recursive:true});
for(const e of events)e.meta=Object.fromEntries(['step','question_id','quiz_version','profile'].filter(k=>e.meta[k]!==undefined).map(k=>[k,e.meta[k]]));
fs.writeFileSync('reports/yuki/data-private.json',JSON.stringify({extractedAt:new Date().toISOString(),funnels:selected,sites:sites.filter(s=>keys.includes(s.site_key)),events,attempts,leads,answers}));
console.log(JSON.stringify({events:events.length,attempts:attempts.length,leads:leads.length,answers:answers.length,extractedAt:new Date().toISOString()}));
