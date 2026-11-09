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
    <div class="access-content">`+html+`<p id="access-message" role="status" aria-live="polite"></p></div>
    <div class="access-card-footer">Pessoas e competências, na mesma conexão.</div>
   </div>
  </div>`;
  addPasswordToggles();
 }

 function addPasswordToggles(scope=panel){
  for(const input of scope.querySelectorAll('input[type="password"]')){
   let wrap=input.parentElement;
   if(!wrap.classList.contains('access-input-wrap')){
    wrap=document.createElement('div');wrap.className='access-password-wrap';
    input.before(wrap);wrap.append(input);
   }
   wrap.classList.add('access-password-wrap');
   input.id='access-'+input.name;
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
 function message(text){const el=document.getElementById('access-message');if(el)el.textContent=text;}
 function button(text,action,parent){const b=document.createElement('button');b.textContent=text;b.type='button';b.className='access-secondary';b.onclick=action;parent.append(b);return b;}
 function exit(){auth.signOut().finally(()=>location.reload());}
 function errors(error){console.error('Falha no acesso:',error.code);message(error.code==='auth/too-many-requests'?'Muitas tentativas. Aguarde e tente novamente.':'Não foi possível concluir. Confira os dados ou tente novamente.');}
 function login(register=false){
  show('<p class="access-step">'+(register?'JUNTE-SE À EQUIPE':'BEM-VINDO DE VOLTA')+'</p><h2>'+(register?'Solicitar acesso':'Entrar')+'</h2><p class="access-description">'+(register?'Crie seu acesso. Um sênior avaliará sua solicitação.':'Entre com suas credenciais para acessar a plataforma.')+'</p><form id="access-form"><label>Login<div class="access-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg><input name="login" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="nome.sobrenome" pattern="[A-Za-z0-9._-]{3,64}"></div></label><label>Senha<div class="access-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input name="password" type="password" required autocomplete="'+(register?'new-password':'current-password')+'" placeholder="'+(register?'Crie uma senha':'Digite sua senha')+'"></div></label>'+(register?'<p class="access-field-help">Use pelo menos 6 caracteres. Pode usar apenas números.</p>':'')+'<button type="submit">'+(register?'Enviar solicitação':'Entrar')+'<span aria-hidden="true">↗</span></button></form><div class="access-divider"><span>'+(register?'Já faz parte da equipe?':'Ainda não tem uma conta?')+'</span></div>',register?'register':'login');
  button(register?'Voltar ao login':'Solicitar novo acesso',()=>login(!register),panel.querySelector('.access-content'));
  panel.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=e.target,b=form.querySelector('button[type="submit"]');b.disabled=true;
   try{const name=form.elements.login.value.trim(),password=form.elements.password.value,email=name.toLowerCase()+'@users.quapsese.invalid';
    if(register){if(password.length<6){message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;}
     const result=await auth.createUserWithEmailAndPassword(email,password);
     await db.ref('quapAccess/users/'+result.user.uid).set({login:name,role:'viewer',status:'pending',mustChangePassword:false});
    }else await auth.signInWithEmailAndPassword(email,password);
   }catch(err){errors(err);}finally{b.disabled=false;}
  };
 }
 function changePassword(){
  show('<h2>Troque sua senha inicial</h2><p>Defina uma senha com pelo menos 6 caracteres. Pode usar apenas números.</p><form><label>Nova senha<input name="password" type="password" minlength="6" maxlength="128" required autocomplete="new-password"></label><label>Confirme a senha<input name="confirm" type="password" minlength="6" required autocomplete="new-password"></label><button type="submit">Salvar nova senha</button></form>');
  button('Sair',exit,panel.querySelector('.access-card'));
  panel.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector('button[type="submit"]');if(f.password.value!==f.confirm.value){message('As senhas precisam ser iguais.');return;}b.disabled=true;try{if(f.password.value.length<6) {message('Use pelo menos 6 caracteres. Pode usar apenas números.');return;} await adminAction({action:'changeOwnPassword',password:f.password.value});await auth.signOut();login();message('Senha alterada. Entre com sua nova senha.');}catch(err){errors(err);}finally{b.disabled=false;}};
 }
 function confirmSeniorPassword(){
  return new Promise((resolve,reject)=>{
   const dialog=document.createElement('dialog');dialog.className='access-confirm-dialog';
   dialog.setAttribute('aria-labelledby','access-confirm-title');
   dialog.innerHTML='<h2 id="access-confirm-title">Confirme seu acesso</h2><p>Digite sua senha de sênior para autorizar esta alteração.</p><form><label>Sua senha de acesso<input name="currentPassword" type="password" required autocomplete="current-password"></label><p class="access-confirm-error" role="alert"></p><button type="submit">Confirmar alteração</button><button type="button" class="access-secondary">Cancelar</button></form>';
   panel.append(dialog);addPasswordToggles(dialog);
   const form=dialog.querySelector('form'),input=form.elements.currentPassword,cancel=form.querySelector('.access-secondary'),submit=form.querySelector('[type="submit"]');
   const close=()=>{input.value='';dialog.close();dialog.remove();};
   const abort=()=>{close();reject(Object.assign(new Error('Alteração cancelada.'),{code:'cancelled'}));};
   cancel.onclick=abort;dialog.oncancel=e=>{e.preventDefault();if(!submit.disabled)abort();};
   form.onsubmit=async e=>{
    e.preventDefault();submit.disabled=true;cancel.disabled=true;
    try{
     const user=auth.currentUser;
     if(!user)throw Error('Sessão encerrada.');
     const credential=firebase.auth.EmailAuthProvider.credential(user.email,input.value);
     await user.reauthenticateWithCredential(credential);
     await user.getIdToken(true);
     close();resolve();
    }catch{
     input.value='';dialog.querySelector('.access-confirm-error').textContent='Não foi possível confirmar. Confira sua senha e tente novamente.';
     input.focus();
    }finally{submit.disabled=false;cancel.disabled=false;}
   };
   dialog.showModal();input.focus();
  });
 }
 let functionsReady;
 function loadFunctions(){
  if(typeof app.functions==='function')return Promise.resolve();
  if(!functionsReady)functionsReady=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js';
   script.onload=resolve;
   script.onerror=()=>{script.remove();functionsReady=null;reject(Object.assign(new Error('Não foi possível carregar a gestão de usuários. Verifique a conexão.'),{code:'functions/unavailable'}));};
   document.head.append(script);
  });
  return functionsReady;
 }
 async function adminAction(data){
  try{
   await loadFunctions();
   if(data.action!=='changeOwnPassword')await confirmSeniorPassword();
   const result=await app.functions('us-central1').httpsCallable('manageQuapUsers')(data);
   return result.data;
  }catch(error){
   if(error.code==='cancelled'){message('Alteração cancelada.');throw error;}
   const unavailable=['functions/not-found','functions/unavailable','functions/internal'];
   message(unavailable.includes(error.code)?'A gestão de usuários não está disponível. Tente novamente ou contate o administrador.':error.message||'Não foi possível concluir.');
   throw error;
  }
 }
 function userForm(uid=null,login=''){
  show('<h2>'+(uid?'Redefinir senha':'Criar usuário')+'</h2><p>'+(uid?'Defina uma senha temporária. O usuário deverá trocá-la no próximo acesso.':'O novo usuário terá acesso aprovado e deverá trocar a senha temporária no primeiro acesso.')+'</p><form id="access-user-form">'+(!uid?'<label>Login<input name="login" required autocomplete="off" autocapitalize="none" spellcheck="false" pattern="[A-Za-z0-9._-]{3,64}" placeholder="nome.sobrenome"></label><label>Nível<select name="role"><option value="viewer">Visualizador</option><option value="analyst">Analista</option><option value="senior">Sênior</option></select></label>':'<p id="access-target"></p>')+'<label>Senha temporária<input name="password" type="password" required minlength="6" maxlength="128" autocomplete="new-password"></label><label>Confirme a senha<input name="confirm" type="password" required minlength="6" maxlength="128" autocomplete="new-password"></label><p class="access-field-help">Use pelo menos 6 caracteres. Pode usar apenas números.</p><button type="submit">'+(uid?'Redefinir senha':'Criar usuário')+'</button></form>');
  if(uid)document.getElementById('access-target').textContent='Usuário: '+login;
  const back=button('Voltar',()=>manage(),panel.querySelector('.access-content'));
  panel.querySelector('form').onsubmit=async e=>{
   e.preventDefault();const f=e.target,b=f.querySelector('button[type="submit"]');
   if(f.elements.password.value!==f.elements.confirm.value){message('As senhas precisam ser iguais.');return;}
   b.disabled=true;back.disabled=true;
   try{
    await adminAction(uid?{action:'resetPassword',uid,password:f.elements.password.value}:{action:'create',login:f.elements.login.value.trim(),role:f.elements.role.value,password:f.elements.password.value});
    f.reset();await manage();message(uid?'Senha redefinida. Informe a senha temporária ao usuário.':'Usuário criado. Informe o login e a senha temporária ao usuário.');
   }catch{}finally{b.disabled=false;back.disabled=false;}
  };
 }
 async function manage(){
  show('<h2>Integrantes e solicitações</h2><div id="access-management-actions"></div><div id="access-users">Carregando…</div>');
  button('Criar usuário',()=>userForm(),document.getElementById('access-management-actions'));
  button('Voltar à ferramenta',()=>activate(profile),panel.querySelector('.access-card'));
  try{
   const snapshot=await db.ref('quapAccess/users').once('value'),list=document.getElementById('access-users');if(!list)return;list.textContent='';
   snapshot.forEach(s=>{
    const u=s.val(),row=document.createElement('div');row.className='access-user';
    const title=document.createElement('p');title.textContent=u.login+' · '+(labels[u.role]||u.role)+' · '+({pending:'Aguardando aprovação',approved:'Aprovado',blocked:'Bloqueado'}[u.status]||u.status);row.append(title);
    if(s.key===auth.currentUser.uid){
     const note=document.createElement('p');note.textContent='Sua conta. Alterações de acesso devem ser feitas por outro sênior.';row.append(note);
    }else{
     const select=document.createElement('select');select.setAttribute('aria-label','Nível de '+u.login);
     for(const role of ['viewer','analyst','senior']){const o=document.createElement('option');o.value=role;o.textContent=labels[role];select.append(o);}
     select.value=u.role;select.disabled=u.role==='senior';row.append(select);
     const update=status=>async()=>{
      const controls=[...row.querySelectorAll('button,select')];controls.forEach(c=>c.disabled=true);
      try{await adminAction({action:'profile',uid:s.key,role:select.value,status});await manage();message('Acesso atualizado.');}
      catch{}finally{controls.forEach(c=>c.disabled=false);select.disabled=u.role==='senior';}
     };
     if(u.role!=='senior'){
      button(u.status==='pending'?'Aprovar':'Salvar nível e liberar acesso',update('approved'),row);
      button('Bloquear',update('blocked'),row);
     }
     button('Redefinir senha',()=>userForm(s.key,u.login),row);
    }
    list.append(row);
   });
  }catch(err){errors(err);}
 }
 function activate(p){
  panel.hidden=true;panel.textContent='';root.style.display='';root.inert=false;bar.hidden=false;bar.textContent=p.login+' · '+labels[p.role]+' ';
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
