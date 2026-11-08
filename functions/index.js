const {onCall,HttpsError}=require('firebase-functions/v2/https');
const admin=require('firebase-admin');
admin.initializeApp();
const users=()=>admin.database().ref('quapAccess/users');
const {validPassword,canManage}=require('./policy');
exports.changePassword=onCall(async request=>{
  if(!request.auth) throw new HttpsError('unauthenticated','Entre novamente.');
  const password=request.data?.password;
  if(!validPassword(password)) throw new HttpsError('invalid-argument','Use pelo menos 12 caracteres, letras e números.');
  // Only this trusted endpoint clears the mandatory-change flag, after Auth succeeds.
  await admin.auth().updateUser(request.auth.uid,{password});
  await users().child(request.auth.uid).update({mustChangePassword:false});
  return {ok:true};
});
exports.manageAccess=onCall(async request=>{
  if(!request.auth) throw new HttpsError('unauthenticated','Entre novamente.');
  const actor=(await users().child(request.auth.uid).get()).val();
  const {uid,role,status}=request.data||{};
  if(!canManage(actor,request.auth.uid,uid,role,status)) throw new HttpsError('permission-denied','Ação não permitida.');
  const target=users().child(uid);
  await target.transaction(current=>{
    if(!current || current.role==='senior') return;
    return {...current,role,status,approvedBy:request.auth.uid,updatedAt:Date.now()};
  }).then(result=>{if(!result.committed) throw new HttpsError('failed-precondition','Usuário indisponível ou sênior protegido.');});
  return {ok:true};
});
