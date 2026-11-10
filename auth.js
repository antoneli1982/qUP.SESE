/* Authentication and permissions. Passwords are handled exclusively by Firebase Auth. */
(()=>{
 const app=firebase.apps.find(a=>a.name==='quap-quapsese');
 const auth=app.auth(),db=app.database(app.options.databaseURL);
 let profile=null,unwatch=()=>{},readyResolve=window.__quapAccessResolve;

 const root=document.getElementById('root');
 const panel=document.createElement('section');panel.id='quap-access';
 document.body.append(panel);
 const bar=document.createElement('aside');bar.id='quap-account';document.body.append(bar);
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
 function message(text){const el=document.getElementById('access-message');if(el){el.textContent=text;el.scrollIntoView({block:'center',behavior:'smooth'});}}
 function button(text,action,parent){const b=document.createElement('button');b.textContent=text;b.type='button';b.className='access-secondary';b.onclick=action;parent.append(b);return b;}
 function exit(){auth.signOut().finally(()=>location.reload());}
 const errorMessages={
  'action/cancelled':'Alteração cancelada.',
  'PERMISSION_DENIED':'Seu perfil não permite esta ação ou as regras de acesso ainda precisam ser atualizadas.',
  'auth/too-many-requests':'Muitas tentativas. Aguarde e tente novamente.',
  'auth/email-already-in-use':'Este login já está em uso.',
  'auth/wrong-password':'Senha de Sênior incorreta.',
  'auth/invalid-credential':'Senha de Sênior incorreta.',
  'auth/invalid-login-credentials':'Senha de Sênior incorreta.',
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
 function errors(error){console.error('Falha no acesso:',error.code||error.message,error);message(errorMessages[error.code||error.message]||'Não foi possível concluir. Confira os dados ou tente novamente.');}

 // User provisioning and password reset (senior only).
 const FUNCTIONS_REGION='southamerica-east1';
 const loginPattern=/^[A-Za-z0-9._-]{3,64}$/;
 const toEmail=name=>name.toLowerCase()+'@users.quapsese.invalid';
 function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('script-load-failed'));document.head.append(s);});}
 async function callFunction(name,data){
  if(typeof app.functions!=='function')await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js');
  const result=await app.functions(FUNCTIONS_REGION).httpsCallable(name)(data);
  return result.data;
 }
 // Uses a secondary app instance so creating the account does not replace the senior's session.
 async function provisionUser(name,password,role){
  await confirmSenior();
  if(!['viewer','analyst','senior'].includes(role))throw new Error('Perfil inválido.');
  const secondary=firebase.initializeApp(app.options,'quap-provision-'+Date.now());
  try{
   const secondaryAuth=secondary.auth();
   await secondaryAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);
   const result=await secondaryAuth.createUserWithEmailAndPassword(toEmail(name),password);
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
  show('<p class="access-step">BEM-VINDO DE VOLTA</p><h2>Entrar</h2><p class="access-description">Entre com suas credenciais para acessar a plataforma.</p><form id="access-form"><label>Login<input name="login" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="nome.sobrenome" pattern="[A-Za-z0-9._-]{3,64}"></label><label>Senha<input name="password" type="password" required autocomplete="current-password" placeholder="Digite sua senha"></label><button type="submit">Entrar</button></form><p class="access-field-help">Ainda não tem uma conta? Solicite o cadastro a um Sênior. Apenas esse perfil pode cadastrar usuários na ferramenta.</p>','login');
  panel.querySelector('form').onsubmit=async e=>{
   e.preventDefault();const form=e.target,b=form.querySelector('button[type="submit"]');b.disabled=true;
   try{await auth.signInWithEmailAndPassword(toEmail(form.elements.login.value.trim()),form.elements.password.value);}
   catch(err){errors(err);}finally{b.disabled=false;}
  };
 }
 function changePassword(){
  show('<h2>Troque sua senha inicial</h2><p>Defina uma senha com pelo menos 6 caracteres. Pode usar apenas números.</p><form><label>Nova senha<input name="password" type="password" minlength="6" maxlength="128" required autocomplete="new-password"></label><label>Confirme a senha<input name="confirm" type="password" minlength="6" required autocomplete="new-password"></label><button type="submit">Salvar nova senha</button></form>');
  button('Sair',exit,panel.querySelector('.access-card'));
  panel.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector('button[type="submit"]');if(f.password.value!==f.confirm.value){message('As senhas precisam ser iguais.');return;}b.disabled=true;try{if(f.password.value.length<6) {message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;} await auth.currentUser.updatePassword(f.password.value);await db.ref('quapAccess/users/'+auth.currentUser.uid+'/mustChangePassword').set(false);await auth.currentUser.getIdToken(true);}catch(err){errors(err);}finally{b.disabled=false;}};
 }
 async function manage(){
  if(profile?.role!=='senior'||profile.status!=='approved'||profile.mustChangePassword!==false){message('Apenas o Sênior pode gerenciar integrantes.');return;}
  show('<h2>Integrantes e solicitações</h2><form id="access-new-user" class="access-new-user"><h3>Novo integrante</h3><label>Login<input name="login" required autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="nome.sobrenome" pattern="[A-Za-z0-9._-]{3,64}"></label><label>Senha inicial<input name="password" type="password" minlength="6" maxlength="128" required autocomplete="new-password"></label><label>Perfil<select name="role"><option value="viewer">Visualizador</option><option value="analyst">Analista</option><option value="senior">Sênior</option></select></label><p class="access-field-help">O integrante entra com esta senha e precisa trocá-la no primeiro acesso.</p><button type="submit">Cadastrar integrante</button></form><div id="access-users">Carregando…</div>');
  button('Voltar à ferramenta',()=>activate(profile),panel.querySelector('.access-card'));
  const newUserForm=document.getElementById('access-new-user');
  newUserForm.onsubmit=async e=>{
   e.preventDefault();
   const submit=newUserForm.querySelector('button[type="submit"]');
   const name=newUserForm.elements.login.value.trim(),password=newUserForm.elements.password.value,role=newUserForm.elements.role.value;
   if(!loginPattern.test(name)){message('Login: de 3 a 64 caracteres, com letras, números, ponto, hífen ou sublinhado.');return;}
   if(password.length<6){message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;}
   if(!['viewer','analyst','senior'].includes(role))return;
   submit.disabled=true;
   try{await provisionUser(name,password,role);await manage();message('Integrante '+name+' cadastrado. Informe a senha inicial a ele.');}
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
  panel.hidden=true;root.style.display='';root.inert=false;bar.hidden=false;bar.textContent=p.login+' · '+labels[p.role]+' ';
  if(p.role==='senior')button('Gerenciar integrantes',manage,bar);button('Sair',exit,bar);
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
 auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(()=>auth.onAuthStateChanged(user=>{
  unwatch();if(!user){profile=null;login();return;}
  const ref=db.ref('quapAccess/users/'+user.uid),handler=s=>accept(s.val());ref.on('value',handler,error=>{root.inert=true;root.style.display='none';show('<p>Não foi possível confirmar sua permissão. Entre novamente.</p>');button('Sair',exit,panel.querySelector('.access-card'));errors(error);});unwatch=()=>ref.off('value',handler);
 })).catch(errors);
 const mutationLabel=/salvar|excluir|remover|adicionar|novo|nova|importar|editar|cadastrar|aplicar|confirmar|registrar/i;
 function refreshWriteButtons(){for(const b of root.querySelectorAll('button')){const readonly=profile?.role==='viewer'&&mutationLabel.test(b.textContent+' '+b.getAttribute('aria-label'));if(readonly&&!b.disabled){b.dataset.quapReadOnly='true';b.disabled=true;b.title='Seu perfil permite somente leitura.';}else if(!readonly&&b.dataset.quapReadOnly){b.disabled=false;delete b.dataset.quapReadOnly;b.removeAttribute('title');}}}
 new MutationObserver(refreshWriteButtons).observe(root,{childList:true,subtree:true,characterData:true});
 // UI guidance; database rules independently enforce this restriction.
 document.addEventListener('click',e=>{if(profile?.role!=='viewer'||!root.contains(e.target))return;const b=e.target.closest('button');if(b&&/salvar|excluir|remover|adicionar|novo|nova|importar|editar|cadastrar|aplicar|confirmar|registrar/i.test(b.textContent+' '+b.getAttribute('aria-label'))){e.preventDefault();e.stopImmediatePropagation();alert('Seu perfil permite somente leitura.');}},true);
})();
