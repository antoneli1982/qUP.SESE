// Run once by the project administrator after reconnecting Firebase CLI.
const admin=require('firebase-admin');
const path=require('node:path');
const toolsPath=process.env.FIREBASE_TOOLS_PATH;
if(!toolsPath) throw Error('Defina FIREBASE_TOOLS_PATH para firebase-tools/lib.');
const cli=require(path.join(toolsPath,'auth'));
const credential={async getAccessToken(){const account=cli.getGlobalDefaultAccount();if(!account)throw Error('Reconecte a conta Firebase.');const token=await cli.getAccessToken(account.tokens.refresh_token,[]);return {access_token:token.access_token,expires_in:3600};}};
admin.initializeApp({projectId:'controlmaterials',databaseURL:'https://controlmaterials-default-rtdb.firebaseio.com',credential});
(async()=>{
 for(const login of ['Ivan.Antoneli','Grabriela.Baptista']){
  const email=login.toLowerCase()+'@users.quapsese.invalid';
  let user;
  try{user=await admin.auth().getUserByEmail(email);const profile=await admin.database().ref('quapAccess/users/'+user.uid).get();if(!profile.exists())throw Error('Conta existente sem perfil: revise manualmente '+login);console.log(login+': conta existente preservada');continue;}
  catch(e){if(e.code!=='auth/user-not-found')throw e;}
  user=await admin.auth().createUser({email,password:'123456',displayName:login});
  await admin.database().ref('quapAccess/users/'+user.uid).set({login,role:'senior',status:'approved',mustChangePassword:true});
  console.log(login+': criado com troca obrigatória');
 }
})().then(()=>process.exit(0)).catch(e=>{console.error(e.message);process.exit(1);});
