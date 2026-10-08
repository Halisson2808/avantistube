import fs from 'node:fs';
const r=await fetch('https://yukinakamura.vercel.app/');
if(!r.ok)throw new Error('HTTP '+r.status);
const html=await r.text();fs.writeFileSync('reports/yuki/site-snapshot.html',html);
console.log(JSON.stringify({status:r.status,bytes:html.length,scriptSources:[...html.matchAll(/<script[^>]*src=["']([^"']+)/g)].map(m=>m[1])}));
