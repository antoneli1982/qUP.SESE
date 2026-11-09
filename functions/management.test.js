'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createManager}=require('./management');
class HttpsError extends Error {constructor(code,message){super(message);this.code=code;}}
function setup(){
 const profiles={
  boss:{login:'boss',role:'senior',status:'approved',mustChangePassword:false},
  viewer:{login:'viewer',role:'viewer',status:'approved',mustChangePassword:false},
  trainee:{login:'trainee',role:'viewer',status:'pending',mustChangePassword:false}
 };
 const calls=[];let failSet=false;
 const db={ref:path=>{
  const [, , uid, field]=path.split('/');
  return {
   get:async()=>({val:()=>profiles[uid]||null}),
   set:async value=>{if(failSet)throw Error('database unavailable');if(field)profiles[uid][field]=value;else profiles[uid]=value;},
   transaction:async fn=>{const next=fn(profiles[uid]||null);if(next===undefined)return {committed:false};profiles[uid]=next;return {committed:true};}
  };
 }};
 const auth={
  createUser:async data=>{calls.push(['create',data]);return {uid:'newuser'};},
  deleteUser:async uid=>calls.push(['delete',uid]),
  updateUser:async(uid,data)=>calls.push(['password',uid,data]),
  revokeRefreshTokens:async uid=>calls.push(['revoke',uid])
 };
 const manager=createManager({auth,db,HttpsError});
 return {run:(uid,data,time=Math.floor(Date.now()/1000))=>manager(uid,data,time),profiles,calls,auth,failSet:()=>{failSet=true;}};
}
test('rejects anonymous, viewers, blocked seniors and seniors awaiting password change',async()=>{
 for(const mode of ['anonymous','viewer','blocked','temporary']){
  const t=setup();let uid=mode==='anonymous'?null:mode==='viewer'?'viewer':'boss';
  if(mode==='blocked')t.profiles.boss.status='blocked';
  if(mode==='temporary')t.profiles.boss.mustChangePassword=true;
  await assert.rejects(t.run(uid,{action:'create',login:'new',role:'senior',password:'123456'}));
  assert.equal(t.calls.length,0);
 }
});
test('creates all levels, preserves numeric password and stores no password in profiles',async()=>{
 for(const role of ['viewer','analyst','senior']){
  const t=setup();await t.run('boss',{action:'create',login:'New.User',role,password:'012345'});
  assert.deepEqual(t.profiles.newuser,{login:'New.User',role,status:'approved',mustChangePassword:true});
  assert.equal(t.calls[0][1].password,'012345');
  assert.equal(t.calls[0][1].email,'new.user@users.quapsese.invalid');
 }
});
test('rejects malformed login, short password, unknown role and self changes',async()=>{
 for(const patch of [{login:'x/y'},{password:'12345'},{role:'owner'}]){
  const t=setup();await assert.rejects(t.run('boss',{action:'create',login:'newuser',password:'123456',role:'viewer',...patch}));
  assert.equal(t.calls.length,0);
 }
 const t=setup();
 for(const action of ['profile','resetPassword'])await assert.rejects(t.run('boss',{action,uid:'boss',password:'123456',role:'viewer',status:'blocked'}));
});
test('rolls back new Auth account if profile write fails',async()=>{
 const t=setup();t.failSet();
 await assert.rejects(t.run('boss',{action:'create',login:'newuser',password:'123456',role:'viewer'}));
 assert.equal(t.calls[1][0],'delete');
});
test('approves and promotes users, prevents stale demotion or blocking of seniors',async()=>{
 const t=setup();
 await t.run('boss',{action:'profile',uid:'trainee',role:'senior',status:'approved'});
 assert.equal(t.profiles.trainee.role,'senior');
 await assert.rejects(t.run('boss',{action:'profile',uid:'trainee',role:'viewer',status:'approved'}));
 await assert.rejects(t.run('boss',{action:'profile',uid:'trainee',role:'senior',status:'blocked'}));
});
test('reset closes access, changes password and revokes sessions',async()=>{
 const t=setup();await t.run('boss',{action:'resetPassword',uid:'viewer',password:'654321'});
 assert.equal(t.profiles.viewer.mustChangePassword,true);
 assert.ok(t.profiles.viewer.passwordResetAt>0);
 assert.deepEqual(t.calls.map(c=>c[0]),['password','revoke']);
});
test('reset failure keeps access closed',async()=>{
 const t=setup();t.auth.updateUser=async()=>{throw Error('failure');};
 await assert.rejects(t.run('boss',{action:'resetPassword',uid:'viewer',password:'654321'}));
 assert.equal(t.profiles.viewer.mustChangePassword,true);
});
test('only fresh authenticated session can finish mandatory password change',async()=>{
 const t=setup();t.profiles.viewer.mustChangePassword=true;t.profiles.viewer.passwordResetAt=100;
 await assert.rejects(t.run('viewer',{action:'changeOwnPassword',password:'654321'},99));
 assert.equal(t.calls.length,0);
 await t.run('viewer',{action:'changeOwnPassword',password:'654321'},101);
 assert.equal(t.profiles.viewer.mustChangePassword,false);
 assert.deepEqual(t.calls.map(c=>c[0]),['password','revoke']);
});
test('unknown actions and missing users cannot be changed',async()=>{
 const t=setup();
 await assert.rejects(t.run('boss',{action:'delete'}));
 await assert.rejects(t.run('boss',{action:'profile',uid:'missing',role:'viewer',status:'approved'}));
 await assert.rejects(t.run('boss',{action:'resetPassword',uid:'missing',password:'123456'}));
 assert.equal(t.calls.length,0);
});

test('administrative changes reject stale authentication even for an approved senior',async()=>{
 const t=setup();
 await assert.rejects(t.run('boss',{action:'create',login:'newuser',role:'viewer',password:'123456'},Math.floor(Date.now()/1000)-61),{code:'unauthenticated'});
 assert.equal(t.calls.length,0);
});
