import {createServer} from 'node:http';import {DatabaseSync} from 'node:sqlite';import {randomUUID} from 'node:crypto';import {readFile} from 'node:fs/promises';
import {plan} from '../reserveroute-engine/index.mjs';
import {refreshAndBuild,capture} from './stellar.mjs';
export const sample=JSON.parse(await readFile(new URL('../reserveroute-engine/sample.json',import.meta.url),'utf8'));
export function createApp({dbPath=':memory:',token='',evidencePath=new URL('./testnet-evidence.json',import.meta.url),builder=refreshAndBuild,captureFn=capture}={}){const db=new DatabaseSync(dbPath);db.exec('CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, created_at TEXT NOT NULL, data TEXT NOT NULL)');
 const reply=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));};
 const server=createServer(async(req,res)=>{try{const host=req.headers.host??'';if(!/^(127\.0\.0\.1|localhost):\d+$/.test(host))return reply(res,403,{error:'Local Host required'});const origin=req.headers.origin;if(origin&&!/^http:\/\/(127\.0\.0\.1|localhost):(4340|4341)$/.test(origin))return reply(res,403,{error:'Origin refused'});if(token&&req.headers.authorization!=='Bearer '+token)return reply(res,401,{error:'Bearer token required'});const path=new URL(req.url,'http://127.0.0.1').pathname;
 if(req.method==='GET'&&path==='/api/health')return reply(res,200,{project:'reserveroute',mode:'local-development',signing:false});
 if(req.method==='GET'&&path==='/api/sample')return reply(res,200,sample);
 if(req.method==='GET'&&path==='/api/evidence')return reply(res,200,JSON.parse(await readFile(evidencePath,'utf8')));
 if(req.method==='GET'&&path==='/api/runs')return reply(res,200,db.prepare('SELECT id,created_at,data FROM runs ORDER BY rowid DESC LIMIT 100').all().map(r=>({id:r.id,createdAt:r.created_at,status:JSON.parse(r.data).report.status,mode:JSON.parse(r.data).mode})));
 if(req.method==='GET'&&/^\/api\/runs\/[\w-]+$/.test(path)){const r=db.prepare('SELECT data FROM runs WHERE id=?').get(path.split('/').pop());return r?reply(res,200,JSON.parse(r.data)):reply(res,404,{error:'Run not found'});}
 if(req.method==='POST'&&['/api/plan','/api/build','/api/capture'].includes(path)){let size=0,parts=[];for await(const part of req){size+=part.length;if(size>1048576)return reply(res,413,{error:'JSON exceeds 1 MiB'});parts.push(part);}let input;try{input=JSON.parse(Buffer.concat(parts).toString());}catch{return reply(res,422,{error:'Invalid JSON'});}let data;try{if(path==='/api/capture'){return reply(res,200,await captureFn(input.accountIds));}if(path==='/api/build'){return reply(res,200,await builder(input.snapshot,input.actions));}data={mode:'snapshot-plan',snapshot:input.snapshot,actions:input.actions,report:plan(input.snapshot,input.actions)};}catch(e){return reply(res,e.message.includes('replan')?409:422,{error:e.message});}const id=randomUUID(),createdAt=new Date().toISOString();db.prepare('INSERT INTO runs VALUES(?,?,?)').run(id,createdAt,JSON.stringify(data));return reply(res,201,{id,createdAt,...data});}
 return reply(res,404,{error:'Route not found'});
 }catch(e){reply(res,500,{error:e.code==='ENOENT'?'Public evidence not installed':'Internal request failure'});}});
 return {server,close:async()=>{await new Promise(r=>server.close(r));db.close();}};
}
