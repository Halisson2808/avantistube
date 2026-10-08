import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync('reports/yuki/data-private.json','utf8'));
const group=(rows,key)=>{const m=new Map();for(const r of rows){const k=key(r);if(!m.has(k))m.set(k,[]);m.get(k).push(r);}return m;};
const unique=(r,key)=>new Set(r.map(key).filter(Boolean)).size;
const quiz=d.events.filter(e=>e.meta.quiz_version==='v2-2026-09-17');
const first=quiz.map(e=>e.created_at).sort()[0];
const testSessions=new Set(d.events.filter(e=>/teste/i.test(e.event_name)).map(e=>e.session_id));
const events=d.events.filter(e=>e.created_at>=first&&!testSessions.has(e.session_id));
const sessions=group(events,e=>e.session_id);
const names=['quiz_started','quiz_question_answered','lead_captured','quiz_completed','result_viewed','offer_viewed','checkout_started'];
const open=Object.fromEntries(names.map(n=>[n,{events:events.filter(e=>e.event_name===n).length,sessions:unique(events.filter(e=>e.event_name===n),e=>e.session_id),visitors:unique(events.filter(e=>e.event_name===n),e=>e.visitor_id)}]));
const questions=Array.from({length:6},(_,i)=>{const rows=events.filter(e=>e.event_name==='quiz_question_answered'&&Number(e.meta.step)===i+1);return {number:i+1,key:rows[0]?.meta.question_id,label:d.answers.find(a=>a.question_key===rows[0]?.meta.question_id)?.question_label,events:rows.length,sessions:unique(rows,e=>e.session_id),visitors:unique(rows,e=>e.visitor_id)};});
const startSessions=[...sessions.values()].filter(rows=>rows.some(e=>e.event_name==='quiz_started'));
const funnel=[{label:'Iniciou o quiz',count:startSessions.length}];let cohort=startSessions;
for(const q of questions){cohort=cohort.filter(rows=>rows.some(e=>e.event_name==='quiz_question_answered'&&Number(e.meta.step)===q.number));funnel.push({label:'Pergunta '+q.number,count:cohort.length});}
for(const n of ['quiz_completed','result_viewed','offer_viewed','checkout_started']){cohort=cohort.filter(rows=>rows.some(e=>e.event_name===n));funnel.push({label:n,count:cohort.length});}
const entry=[...sessions.values()].filter(rows=>rows.some(e=>e.event_name==='pageview'&&e.path==='/'));
const entryCounts={sessions:entry.length,visitors:unique(entry.flat().filter(e=>e.event_name==='pageview'&&e.path==='/'),e=>e.visitor_id),started:entry.filter(rows=>rows.some(e=>e.event_name==='quiz_started')).length,completed:entry.filter(rows=>rows.some(e=>e.event_name==='quiz_completed')).length};
const histogram=Array.from({length:7},(_,n)=>({questions:n,sessions:startSessions.filter(rows=>new Set(rows.filter(e=>e.event_name==='quiz_question_answered').map(e=>e.meta.question_id)).size===n).length}));
const counts=group(d.answers,a=>a.attempt_id);
const attemptsHistogram=Array.from({length:7},(_,n)=>({questions:n,attempts:d.attempts.filter(a=>(counts.get(a.id)||[]).length===n).length}));
const anomalies={quizWithoutStart:unique(events.filter(e=>names.slice(1).includes(e.event_name)&&!startSessions.some(rows=>rows[0].session_id===e.session_id)),e=>e.session_id),completedWithoutLead:unique(events.filter(e=>e.event_name==='quiz_completed'&&!sessions.get(e.session_id).some(r=>r.event_name==='lead_captured')),e=>e.session_id),startWithoutEntry:startSessions.filter(rows=>!rows.some(e=>e.event_name==='pageview'&&e.path==='/')).length};
const daily=[...group(events,e=>new Date(new Date(e.created_at).getTime()-4*3600000).toISOString().slice(0,10))].sort(([a],[b])=>a.localeCompare(b)).map(([day,rows])=>({day,entry:unique(rows.filter(e=>e.event_name==='pageview'&&e.path==='/'),e=>e.session_id),started:unique(rows.filter(e=>e.event_name==='quiz_started'),e=>e.session_id),completed:unique(rows.filter(e=>e.event_name==='quiz_completed'),e=>e.session_id),leads:unique(rows.filter(e=>e.event_name==='lead_captured'),e=>e.session_id)}));
const s={extractedAt:d.extractedAt,first,last:events.map(e=>e.created_at).sort().at(-1),explicitTestSessionsExcluded:testSessions.size,events:events.length,entryCounts,open,questions,funnel,histogram,attempts:{total:d.attempts.length,uniqueSessions:unique(d.attempts,a=>a.session_id),completed:d.attempts.filter(a=>a.completed_at).length,completedSessions:unique(d.attempts.filter(a=>a.completed_at),a=>a.session_id),leads:d.leads.length,histogram:attemptsHistogram},anomalies,daily};
fs.writeFileSync('reports/yuki/summary.json',JSON.stringify(s,null,2));console.log(JSON.stringify(s,null,2));
