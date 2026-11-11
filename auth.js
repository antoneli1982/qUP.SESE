/* Authentication and permissions. Passwords are handled exclusively by Firebase Auth. */
(()=>{
 const app=firebase.apps.find(a=>a.name==='quap-quapsese');
 const auth=app.auth(),db=app.database(app.options.databaseURL);
 auth.languageCode='pt-BR';
 const actionParams=new URLSearchParams(location.search);
 let emailResetActive=actionParams.get('mode')==='resetPassword'&&!!actionParams.get('oobCode');
 const emailActionActive=['verifyEmail','verifyAndChangeEmail','recoverEmail'].includes(actionParams.get('mode'))&&!!actionParams.get('oobCode');
 let profile=null,unwatch=()=>{},readyResolve=window.__quapAccessResolve;

 const root=document.getElementById('root');
 const panel=document.createElement('section');panel.id='quap-access';
 document.body.append(panel);
 const bar=document.createElement('aside');bar.id='quap-account';bar.setAttribute('aria-label','Minha conta');
 function placeAccountMenu(){
  const hosts=[...document.querySelectorAll('[data-account-menu-host]')];
  const host=hosts.find(item=>item.closest('[role=dialog]'))||hosts[0];
  if(host&&bar.parentElement!==host)host.append(bar);
 }
 new MutationObserver(placeAccountMenu).observe(document.body,{childList:true,subtree:true});
 const labels={senior:'Sênior',analyst:'Analista',viewer:'Visualizador'};
 function show(html,mode='account'){
  root.inert=true;root.style.display='none';bar.hidden=true;panel.hidden=false;panel.dataset.mode=mode;
  panel.innerHTML=`<div class="access-layout">
   <aside class="access-intro" aria-label="qUAP SESE">
    <div class="access-brand"><div class="access-product-brand"><img src="logo-original.png" alt="Cérebro sendo abastecido, logo original do qUAP" width="96" height="96"><span>qUAP</span></div><span class="access-brand-separator" aria-hidden="true"></span><img class="access-sese-logo" src="logo-sese.png" alt="SESÉ" width="120" height="37"></div>
    <div class="access-intro-copy"><p class="access-eyebrow">CONEXÕES QUE DESENVOLVEM</p><h1>Conhecimento conectado.<br><span>Equipes em evolução.</span></h1><p>Uma visão integrada das pessoas, das competências e do desenvolvimento da sua equipe.</p></div>
    <img class="access-neural-art" src="neural-network.svg" alt="Empilhadeira guardando uma caixa no porta-paletes, desenhada com redes neurais dentro de um cérebro rabiscado" width="640" height="420">
    <div class="access-intro-footer"><span class="access-status-dot"></span> Gestão de competências</div>
   </aside>
   <div class="access-card">
    <div class="access-card-brand"><img src="logo-original.png" alt="Cérebro sendo abastecido, logo original do qUAP" width="36" height="36"><span>qUAP</span><img class="access-sese-logo" src="logo-sese.png" alt="SESÉ" width="76" height="23"><span class="access-restricted"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/></svg>Área restrita</span></div>
    <div class="access-content"><p id="access-message" role="status" aria-live="polite"></p>`+html+`</div>
    <div class="access-card-footer">Pessoas e competências, na mesma conexão.</div>
   </div>
  </div>`;
  addPasswordToggles();
 }

 let passwordFieldId=0;
 function addPasswordToggles(scope=panel){
  for(const input of scope.querySelectorAll('input[type="password"]')){
   if(input.dataset.quapPasswordToggle)continue;
   input.dataset.quapPasswordToggle='true';
   let wrap=input.parentElement;
   if(!wrap.classList.contains('access-password-wrap')){
    wrap=document.createElement('div');wrap.className='access-password-wrap';
    input.before(wrap);wrap.append(input);
   }
   wrap.classList.add('access-password-wrap');
   if(!input.id)input.id='access-password-'+(++passwordFieldId);
   const toggle=document.createElement('button');toggle.type='button';toggle.className='access-password-toggle';
   toggle.setAttribute('aria-controls',input.id);
   const render=()=>{
    const visible=input.type==='text';
    const label=visible?'Ocultar senha':'Mostrar senha';
    toggle.setAttribute('aria-label',label);toggle.title=label;
    toggle.setAttribute('aria-pressed',String(visible));
    toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'+(visible?'<path d="m3 3 18 18"/>':'')+'</svg>';
   };
   toggle.onclick=()=>{input.type=input.type==='password'?'text':'password';render();};
   render();wrap.append(toggle);
  }
 }
 function message(text,success=false){const el=document.getElementById('access-message');if(el){el.dataset.success=String(success);el.textContent=text;el.scrollIntoView({block:'center',behavior:'smooth'});}}
 function button(text,action,parent){const b=document.createElement('button');b.textContent=text;b.type='button';b.className='access-secondary';b.onclick=action;parent.append(b);return b;}
 function exit(){auth.signOut().finally(()=>location.reload());}
 const errorMessages={
  'action/cancelled':'Alteração cancelada.',
  'PERMISSION_DENIED':'Seu perfil não permite esta ação ou as regras de acesso ainda precisam ser atualizadas.',
  'auth/too-many-requests':'Muitas tentativas. Aguarde e tente novamente.',
  'auth/email-already-in-use':'Este login já está em uso.',
  'auth/wrong-password':'Login/e-mail ou senha atual incorretos.',
  'auth/invalid-credential':'Login/e-mail ou senha atual incorretos.',
  'auth/invalid-login-credentials':'Login/e-mail ou senha atual incorretos.',
  'auth/user-not-found':'Login/e-mail ou senha atual incorretos.',
  'auth/requires-recent-login':'Confirme sua senha atual e tente novamente.',
  'auth/user-disabled':'Esta conta está desativada. Procure o responsável pela ferramenta.',
  'auth/expired-action-code':'Este link expirou. Solicite um novo link em Esqueci minha senha.',
  'auth/invalid-action-code':'Este link já foi usado ou é inválido. Solicite um novo link em Esqueci minha senha.',
  'auth/network-request-failed':'Falha de conexão. Verifique a internet e tente novamente.',
  'auth/operation-not-allowed':'O login por e-mail/senha não está habilitado no Firebase.',
  'auth/invalid-email':'Login inválido.',
  'auth/weak-password':'Use pelo menos 6 caracteres. Pode usar apenas números.',
  'functions/permission-denied':'Seu perfil não permite esta ação.',
  'functions/not-found':'Integrante não encontrado ou função de senha não publicada no Firebase.',
  'functions/unauthenticated':'Sua sessão expirou. Entre novamente.',
  'functions/invalid-argument':'Dados inválidos. Confira a senha informada.',
  'script-load-failed':'Não foi possível carregar o módulo de senhas. Verifique a conexão.'
 };
 function errors(error){console.error('Falha no acesso:',error.code||'unknown');message(errorMessages[error.code||error.message]||'Não foi possível concluir. Confira os dados ou tente novamente.');}

 // User provisioning and password reset (senior only).
 const FUNCTIONS_REGION='southamerica-east1';
 const loginPattern=/^[A-Za-z0-9._-]{3,64}$/;
 const toEmail=name=>name.trim().toLowerCase().includes('@')?name.trim().toLowerCase():name.trim().toLowerCase()+'@users.quapsese.invalid';
 const realEmail=email=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)&&!email.toLowerCase().endsWith('.invalid');
 function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('script-load-failed'));document.head.append(s);});}
 async function callFunction(name,data){
  if(typeof app.functions!=='function')await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js');
  const result=await app.functions(FUNCTIONS_REGION).httpsCallable(name)(data);
  return result.data;
 }
 // Uses a secondary app instance so creating the account does not replace the senior's session.
 async function provisionUser(name,password,role,email){
  if(!realEmail(email))throw Object.assign(new Error(),{code:'auth/invalid-email'});
  await confirmSenior();
  if(!['viewer','analyst','senior'].includes(role))throw new Error('Perfil inválido.');
  const secondary=firebase.initializeApp(app.options,'quap-provision-'+Date.now());
  try{
   const secondaryAuth=secondary.auth();
   await secondaryAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);
   const result=await secondaryAuth.createUserWithEmailAndPassword(email,password);
   try{
    await db.ref('quapAccess/users/'+result.user.uid).set({login:name,role,status:'approved',mustChangePassword:true});
   }catch(err){
    // Roll back the orphan account if the profile could not be written.
    await result.user.delete().catch(()=>{});
    throw err;
   }
   await secondaryAuth.signOut();
  }finally{await secondary.delete().catch(()=>{});}
 }
 async function confirmSenior(){
  const user=auth.currentUser;
  if(!user)throw Object.assign(new Error(),{code:'functions/unauthenticated'});
  const current=(await db.ref('quapAccess/users/'+user.uid).once('value')).val();
  if(current?.role!=='senior'||current.status!=='approved'||current.mustChangePassword!==false)throw Object.assign(new Error(),{code:'functions/permission-denied'});
  const password=await new Promise(resolve=>{
   const dialog=document.createElement('dialog');dialog.className='quap-confirm';
   dialog.innerHTML='<form method="dialog"><h3>Confirme sua senha de Sênior</h3><label>Senha<input name="password" type="password" autocomplete="current-password" required></label><div class="quap-confirm-actions"><button type="button">Cancelar</button><button type="submit">Confirmar</button></div></form>';
   document.body.append(dialog);
   const finish=value=>{dialog.close();dialog.remove();resolve(value);};
   dialog.querySelector('form').onsubmit=e=>{e.preventDefault();finish(e.target.elements.password.value);};
   dialog.querySelector('button[type="button"]').onclick=()=>finish(null);
   dialog.oncancel=e=>{e.preventDefault();finish(null);};
   addPasswordToggles(dialog);
   dialog.showModal();dialog.querySelector('input').focus();
  });
  if(password===null)throw Object.assign(new Error(),{code:'action/cancelled'});
  await user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email,password));
 }
 function login(){
  show('<p class="access-step">BEM-VINDO DE VOLTA</p><h2>Entrar</h2><p class="access-description">Use seu e-mail cadastrado. Contas antigas sem e-mail ainda podem usar o login.</p><form id="access-form"><label>Login ou e-mail<input name="login" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="seu@email.com ou nome.sobrenome"></label><label>Senha<input name="password" type="password" required autocomplete="current-password" placeholder="Digite sua senha"></label><button type="submit">Entrar</button></form><div class="access-help-actions"></div><p class="access-field-help">Ainda não tem uma conta? Solicite o cadastro a um Sênior.</p>','login');
  const help=panel.querySelector('.access-help-actions');
  button('Esqueci minha senha',forgotPassword,help);
  button('Alterar minha senha',()=>credentials('password'),help);
  button('Cadastrar meu e-mail',()=>credentials('email'),help);
  panel.querySelector('form').onsubmit=async e=>{
   e.preventDefault();const form=e.target,b=form.querySelector('button[type="submit"]');b.disabled=true;
   try{await auth.signInWithEmailAndPassword(toEmail(form.elements.login.value.trim()),form.elements.password.value);}
   catch(err){errors(err);}finally{b.disabled=false;}
  };
 }
 function accountBack(){if(profile?.status==='approved'&&!profile.mustChangePassword)activate(profile);else login();}
 function forgotPassword(){
  show('<h2>Esqueci minha senha</h2><p>Informe o e-mail cadastrado na sua conta para receber o link de redefinição.</p><form id="access-recover"><label>E-mail cadastrado<input name="email" type="email" required autocomplete="email" placeholder="seu@email.com"></label><button type="submit">Enviar link de recuperação</button></form><p class="access-field-help">Ainda não cadastrou seu e-mail? É necessário confirmar sua senha atual para vinculá-lo. Se também esqueceu a senha, procure o responsável pela ferramenta.</p>');
  button('Cadastrar meu e-mail',()=>credentials('email'),panel.querySelector('.access-content'));
  button('Já recebi o link',pasteRecoveryLink,panel.querySelector('.access-content'));
  button('Sei a senha atual e quero alterá-la',()=>credentials('password'),panel.querySelector('.access-content'));
  button('Voltar',accountBack,panel.querySelector('.access-content'));
  const form=document.getElementById('access-recover');
  form.onsubmit=async e=>{
   e.preventDefault();const submit=form.querySelector('button[type="submit"]'),email=form.elements.email.value.trim().toLowerCase();
   if(!realEmail(email)){message('Informe um e-mail real que já esteja vinculado à sua conta.');return;}
   submit.disabled=true;
   try{auth.languageCode='pt-BR';await auth.sendPasswordResetEmail(email);message('Se este e-mail estiver cadastrado, você receberá o link para escolher uma nova senha. Confira também o spam.',true);}
   catch(err){if(err.code==='auth/user-not-found')message('Se este e-mail estiver cadastrado, você receberá o link para escolher uma nova senha. Confira também o spam.',true);else errors(err);}
   finally{submit.disabled=false;}
  };
 }
 function pasteRecoveryLink(){
  show('<h2>Usar link de recuperação</h2><p>Copie o link completo do e-mail de recuperação e cole abaixo. Você escolherá a nova senha aqui na ferramenta.</p><form id="access-recovery-link"><label>Link recebido por e-mail<input name="link" type="url" required autocomplete="off" spellcheck="false" placeholder="https://…"></label><button type="submit">Validar link</button></form>');
  button('Voltar',forgotPassword,panel.querySelector('.access-content'));
  const form=document.getElementById('access-recovery-link');
  form.onsubmit=e=>{
   e.preventDefault();
   try{
    const link=new URL(form.elements.link.value.trim());
    const projectLink=link.protocol==='https:'&&((link.hostname==='quapsese.firebaseapp.com'&&link.pathname==='/__/auth/action')||(link.hostname==='antoneli1982.github.io'&&link.pathname==='/qUP.SESE/'));
    if(!projectLink||link.searchParams.get('mode')!=='resetPassword'||!link.searchParams.get('oobCode')){message('Cole o link completo de redefinição recebido para esta ferramenta.');return;}
    const code=link.searchParams.get('oobCode');form.reset();emailResetActive=true;unwatch();resetFromEmail(code);
   }catch{message('O link não é válido. Copie o endereço completo recebido por e-mail.');}
  };
 }
 function credentials(mode){
  const changing=mode==='password';
  show('<h2>'+(changing?'Alterar minha senha':'Cadastrar meu e-mail')+'</h2><p>'+(changing?'Confirme sua senha atual e escolha a nova senha.':'Cadastre um e-mail real para recuperar sua senha. Após confirmar o link recebido, você passará a entrar com esse e-mail; seus dados e perfil serão mantidos.')+'</p><form id="access-credentials"><label>Login ou e-mail atual<input name="login" required autocomplete="username" autocapitalize="none" spellcheck="false"></label><label>Senha atual<input name="currentPassword" type="password" required autocomplete="current-password"></label>'+(changing?'<label>Nova senha<input name="password" type="password" required minlength="6" maxlength="128" autocomplete="new-password"></label><label>Confirme a nova senha<input name="confirm" type="password" required minlength="6" maxlength="128" autocomplete="new-password"></label>':'<label>E-mail de acesso e recuperação<input name="email" type="email" required autocomplete="email" placeholder="seu@email.com"></label><label>Confirme o e-mail<input name="confirmEmail" type="email" required autocomplete="off" placeholder="Repita seu e-mail"></label>')+'<button type="submit">'+(changing?'Salvar nova senha':'Enviar confirmação de e-mail')+'</button></form>');
  button('Voltar',accountBack,panel.querySelector('.access-content'));
  const form=document.getElementById('access-credentials');
  if(auth.currentUser)form.elements.login.value=auth.currentUser.email;
  if(!changing&&auth.currentUser){
   button('Já confirmei o e-mail',async e=>{
    e.target.disabled=true;
    try{await auth.currentUser.reload();if(realEmail(auth.currentUser.email)){await auth.currentUser.getIdToken(true);accountBack();}else message('A confirmação ainda não foi concluída. Abra o link recebido no seu e-mail.');}
    catch(err){errors(err);}finally{e.target.disabled=false;}
   },panel.querySelector('.access-content'));
   button('Alterar minha senha',()=>credentials('password'),panel.querySelector('.access-content'));
   button('Sair',exit,panel.querySelector('.access-content'));
  }
  form.onsubmit=async e=>{
   e.preventDefault();const f=form.elements,submit=form.querySelector('button[type="submit"]');
   if(changing&&f.password.value!==f.confirm.value){message('As senhas precisam ser iguais.');return;}
   if(changing&&f.password.value===f.currentPassword.value){message('Escolha uma senha diferente da atual.');return;}
   const email=changing?'':f.email.value.trim().toLowerCase();
   if(!changing&&(!realEmail(email)||email!==f.confirmEmail.value.trim().toLowerCase())){message('Informe e confirme o mesmo e-mail real.');return;}
   submit.disabled=true;
   const secondary=firebase.initializeApp(app.options,'quap-self-service-'+Date.now());
   let passwordSaved=false;
   try{
    const secondaryAuth=secondary.auth();secondaryAuth.languageCode='pt-BR';
    await secondaryAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);
    const result=await secondaryAuth.signInWithEmailAndPassword(toEmail(f.login.value),f.currentPassword.value);
    if(changing){
     await result.user.updatePassword(f.password.value);passwordSaved=true;
     const flag=secondary.database(app.options.databaseURL).ref('quapAccess/users/'+result.user.uid+'/mustChangePassword');
     if((await flag.once('value')).val()===true)await flag.set(false);
     f.currentPassword.value='';f.password.value='';f.confirm.value='';
     message('Senha alterada com sucesso. Use a nova senha para entrar e confirmar suas ações.',true);
    }else{
     await result.user.verifyBeforeUpdateEmail(email);
     f.currentPassword.value='';
     message('Enviamos um link de confirmação para o e-mail informado. Confirme o link e depois entre usando esse e-mail e sua senha atual. Antes da confirmação, o acesso anterior continua válido.',true);
    }
   }catch(err){if(passwordSaved){f.currentPassword.value='';f.password.value='';f.confirm.value='';message('A senha foi alterada, mas não foi possível concluir a liberação do primeiro acesso. Entre com a nova senha para finalizar.');}else errors(err);}
   finally{await secondary.auth().signOut().catch(()=>{});await secondary.delete().catch(()=>{});submit.disabled=false;}
  };
 }
 async function resetFromEmail(code){
  // Keep the one-time code in memory, outside the address bar and browser history.
  history.replaceState(null,'',location.pathname);
  show('<h2>Redefinir minha senha</h2><p>Validando seu link de recuperação…</p>');
  const back=()=>location.replace(location.pathname);
  try{
   const email=await auth.verifyPasswordResetCode(code);
   show('<h2>Redefinir minha senha</h2><p id="access-reset-account"></p><form id="access-email-reset"><label>Nova senha<input name="password" type="password" required minlength="6" maxlength="128" autocomplete="new-password"></label><label>Confirme a nova senha<input name="confirm" type="password" required minlength="6" maxlength="128" autocomplete="new-password"></label><button type="submit">Salvar nova senha</button></form>');
   document.getElementById('access-reset-account').textContent='Escolha sua nova senha para '+email+'.';
   button('Voltar para entrar',back,panel.querySelector('.access-content'));
   const form=document.getElementById('access-email-reset');
   form.onsubmit=async e=>{
    e.preventDefault();const f=form.elements,submit=form.querySelector('button[type="submit"]');
    if(f.password.value!==f.confirm.value){message('As senhas precisam ser iguais.');return;}
    submit.disabled=true;
    try{
     await auth.confirmPasswordReset(code,f.password.value);
     form.reset();form.hidden=true;
     message('Senha redefinida com sucesso. Entre com seu e-mail e a nova senha.',true);
    }catch(err){errors(err);submit.disabled=false;}
   };
  }catch(err){errors(err);button('Solicitar outro link',back,panel.querySelector('.access-content'));}
 }
 async function confirmEmailAction(code){
  history.replaceState(null,'',location.pathname);
  show('<h2>Confirmar e-mail</h2><p>Validando seu link…</p>');
  const back=()=>location.replace(location.pathname);
  try{
   const action=await auth.checkActionCode(code);
   show('<h2>Confirmar e-mail</h2><p id="access-email-account"></p>');
   document.getElementById('access-email-account').textContent='Confirme o endereço '+(action.data.email||'da sua conta')+'. Após a confirmação, utilize o e-mail confirmado para entrar e recuperar sua senha.';
   const confirm=button('Confirmar e-mail',async()=>{
    confirm.disabled=true;
    try{await auth.applyActionCode(code);confirm.hidden=true;message('E-mail confirmado com sucesso. Volte para entrar usando o e-mail confirmado e sua senha.',true);}
    catch(err){errors(err);confirm.disabled=false;}
   },panel.querySelector('.access-content'));
  }catch(err){errors(err);}
  button('Voltar para entrar',back,panel.querySelector('.access-content'));
 }
 function changePassword(){
  show('<h2>Troque sua senha inicial</h2><p>Defina uma senha com pelo menos 6 caracteres. Pode usar apenas números.</p><form><label>Nova senha<input name="password" type="password" minlength="6" maxlength="128" required autocomplete="new-password"></label><label>Confirme a senha<input name="confirm" type="password" minlength="6" required autocomplete="new-password"></label><button type="submit">Salvar nova senha</button></form>');
  button('Sair',exit,panel.querySelector('.access-card'));
  panel.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector('button[type="submit"]');if(f.password.value!==f.confirm.value){message('As senhas precisam ser iguais.');return;}b.disabled=true;try{if(f.password.value.length<6) {message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;} await auth.currentUser.updatePassword(f.password.value);await db.ref('quapAccess/users/'+auth.currentUser.uid+'/mustChangePassword').set(false);await auth.currentUser.getIdToken(true);}catch(err){errors(err);}finally{b.disabled=false;}};
 }
 async function manage(){
  if(profile?.role!=='senior'||profile.status!=='approved'||profile.mustChangePassword!==false){message('Apenas o Sênior pode gerenciar integrantes.');return;}
  show('<h2>Integrantes e solicitações</h2><form id="access-new-user" class="access-new-user"><h3>Novo integrante</h3><label>Identificação do integrante<input name="login" required autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="nome.sobrenome" pattern="[A-Za-z0-9._-]{3,64}"></label><label>E-mail de acesso e recuperação<input name="email" type="email" required autocomplete="email" placeholder="integrante@email.com"></label><label>Senha inicial<input name="password" type="password" minlength="6" maxlength="128" required autocomplete="new-password"></label><label>Perfil<select name="role"><option value="viewer">Visualizador</option><option value="analyst">Analista</option><option value="senior">Sênior</option></select></label><p class="access-field-help">O integrante entra com o e-mail e esta senha, precisa trocá-la no primeiro acesso e pode recuperar o acesso por e-mail.</p><button type="submit">Cadastrar integrante</button></form><div id="access-users">Carregando…</div>');
  button('Voltar à ferramenta',()=>activate(profile),panel.querySelector('.access-card'));
  const newUserForm=document.getElementById('access-new-user');
  newUserForm.onsubmit=async e=>{
   e.preventDefault();
   const submit=newUserForm.querySelector('button[type="submit"]');
   const name=newUserForm.elements.login.value.trim(),password=newUserForm.elements.password.value,role=newUserForm.elements.role.value,email=newUserForm.elements.email.value.trim().toLowerCase();
   if(!realEmail(email)){message('Cadastre um e-mail real para acesso e recuperação de senha.');return;}
   if(!loginPattern.test(name)){message('Login: de 3 a 64 caracteres, com letras, números, ponto, hífen ou sublinhado.');return;}
   if(password.length<6){message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;}
   if(!['viewer','analyst','senior'].includes(role))return;
   submit.disabled=true;
   try{await provisionUser(name,password,role,email);await manage();message('Integrante '+name+' cadastrado. Ele deve entrar com o e-mail cadastrado e a senha inicial.',true);}
   catch(err){errors(err);submit.disabled=false;}
  };
  try{const snapshot=await db.ref('quapAccess/users').once('value'),list=document.getElementById('access-users');list.textContent='';
   snapshot.forEach(s=>{const u=s.val(),row=document.createElement('div');row.className='access-user';const title=document.createElement('p');title.textContent=u.login+' · '+(labels[u.role]||u.role)+' · '+({pending:'Aguardando aprovação',approved:'Aprovado',blocked:'Bloqueado'}[u.status]||u.status);row.append(title);
    if(u.role!=='senior'){const select=document.createElement('select');for(const role of ['viewer','analyst','senior']){const o=document.createElement('option');o.value=role;o.textContent=labels[role];select.append(o);}select.value=u.role;row.append(select);
     const update=status=>async e=>{e.target.disabled=true;try{await confirmSenior();await db.ref('quapAccess/users/'+s.key).update({role:select.value,status});await manage();}catch(err){errors(err);e.target.disabled=false;}};
     button(u.status==='pending'?'Aprovar':'Salvar perfil',update('approved'),row);button('Bloquear',update('blocked'),row);
     const resetButton=button('Redefinir senha',()=>{
      resetButton.hidden=true;
      const reset=document.createElement('div');reset.className='access-reset';
      const input=document.createElement('input');input.type='password';input.minLength=6;input.maxLength=128;input.autocomplete='new-password';
      input.placeholder='Nova senha temporária';input.setAttribute('aria-label','Nova senha temporária de '+u.login);
      reset.append(input);
      button('Confirmar redefinição',async e=>{
       const password=input.value;
       if(password.length<6){message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;}
       e.target.disabled=true;
       try{await confirmSenior();await callFunction('quapResetPassword',{uid:s.key,password});await manage();message('Senha de '+u.login+' redefinida. A troca será exigida no próximo acesso.');}
       catch(err){errors(err);e.target.disabled=false;}
      },reset);
      button('Cancelar',()=>{reset.remove();resetButton.hidden=false;},reset);
      row.append(reset);addPasswordToggles(reset);input.focus();
     },row);
    }list.append(row);
   });
  }catch(err){errors(err);}
 }
 function activate(p){
  panel.hidden=true;root.style.display='';root.inert=false;bar.hidden=false;bar.textContent='';const identity=document.createElement('p');identity.className='account-identity';identity.textContent=p.login+' · '+labels[p.role];bar.append(identity);placeAccountMenu();
  if(p.role==='senior')button('Gerenciar integrantes',manage,bar);
  button('Alterar minha senha',()=>credentials('password'),bar);
  button(realEmail(auth.currentUser?.email||'')?'Alterar meu e-mail':'Cadastrar meu e-mail',()=>credentials('email'),bar);
  button('Sair',exit,bar);
  document.body.dataset.quapRole=p.role;refreshWriteButtons();readyResolve();
 }
 function accept(p){
  const wasActive=profile?.status==='approved'&&!profile?.mustChangePassword;
  profile=p;
  if(wasActive&&(!p||p.status!=='approved'||p.mustChangePassword)){root.inert=true;root.style.display='none';location.reload();return;}
  if(!p){show('<p>Seu cadastro não foi concluído. Saia e solicite apoio a um sênior.</p>');button('Sair',exit,panel.querySelector('.access-card'));}
  else if(p.mustChangePassword)changePassword();
  else if(p.status!=='approved'){show('<p>'+ (p.status==='blocked'?'Seu acesso está bloqueado. Consulte um sênior.':'Sua solicitação aguarda aprovação de um sênior.')+'</p>');button('Sair',exit,panel.querySelector('.access-card'));}
  else activate(p);
 }
 window.__quapCanWrite=()=>profile?.status==='approved'&&!profile.mustChangePassword&&['senior','analyst'].includes(profile.role);
 if(emailResetActive)resetFromEmail(actionParams.get('oobCode'));
 if(emailActionActive)confirmEmailAction(actionParams.get('oobCode'));
 auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(()=>auth.onAuthStateChanged(user=>{
  unwatch();if(emailResetActive||emailActionActive)return;if(!user){profile=null;login();return;}
  const ref=db.ref('quapAccess/users/'+user.uid),handler=s=>accept(s.val());ref.on('value',handler,error=>{root.inert=true;root.style.display='none';show('<p>Não foi possível confirmar sua permissão. Entre novamente.</p>');button('Sair',exit,panel.querySelector('.access-card'));errors(error);});unwatch=()=>ref.off('value',handler);
 })).catch(errors);
 const mutationLabel=/salvar|excluir|remover|adicionar|novo|nova|importar|editar|cadastrar|aplicar|confirmar|registrar/i;
 function refreshWriteButtons(){for(const b of root.querySelectorAll('button')){if(b.closest('#quap-account'))continue;const readonly=profile?.role==='viewer'&&mutationLabel.test(b.textContent+' '+b.getAttribute('aria-label'));if(readonly&&!b.disabled){b.dataset.quapReadOnly='true';b.disabled=true;b.title='Seu perfil permite somente leitura.';}else if(!readonly&&b.dataset.quapReadOnly){b.disabled=false;delete b.dataset.quapReadOnly;b.removeAttribute('title');}}}
 new MutationObserver(refreshWriteButtons).observe(root,{childList:true,subtree:true,characterData:true});
 // UI guidance; database rules independently enforce this restriction.
 document.addEventListener('click',e=>{if(profile?.role!=='viewer'||!root.contains(e.target)||e.target.closest('#quap-account'))return;const b=e.target.closest('button');if(b&&/salvar|excluir|remover|adicionar|novo|nova|importar|editar|cadastrar|aplicar|confirmar|registrar/i.test(b.textContent+' '+b.getAttribute('aria-label'))){e.preventDefault();e.stopImmediatePropagation();alert('Seu perfil permite somente leitura.');}},true);
})();
