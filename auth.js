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
 function show(html){root.inert=true;root.style.display='none';bar.hidden=true;panel.hidden=false;panel.innerHTML='<div class="access-card"><h1>qUAP · Acesso seguro</h1>'+html+'<p id="access-message" role="status" aria-live="polite"></p></div>';}
 function message(text){const el=document.getElementById('access-message');if(el)el.textContent=text;}
 function button(text,action,parent){const b=document.createElement('button');b.textContent=text;b.type='button';b.onclick=action;parent.append(b);return b;}
 function exit(){auth.signOut().finally(()=>location.reload());}
 function errors(error){console.error('Falha no acesso:',error.code);message(error.code==='auth/too-many-requests'?'Muitas tentativas. Aguarde e tente novamente.':'Não foi possível concluir. Confira os dados ou tente novamente.');}
 function login(register=false){
  show('<h2>'+ (register?'Solicitar acesso':'Entrar')+'</h2><form id="access-form"><label>Login<input name="login" required autocomplete="username" placeholder="nome.sobrenome" pattern="[A-Za-z0-9._-]{3,64}"></label><label>Senha<input name="password" type="password" required autocomplete="'+(register?'new-password':'current-password')+'"></label><button>'+(register?'Enviar solicitação':'Entrar')+'</button></form>');
  button(register?'Voltar ao login':'Solicitar novo acesso',()=>login(!register),panel.querySelector('.access-card'));
  panel.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=e.target,b=form.querySelector('button');b.disabled=true;
   try{const name=form.elements.login.value.trim(),password=form.elements.password.value,email=name.toLowerCase()+'@users.quapsese.invalid';
    if(register){if(password.length<12||!/[a-zA-Z]/.test(password)||!/[0-9]/.test(password))throw Error('weak');
     const result=await auth.createUserWithEmailAndPassword(email,password);
     await db.ref('quapAccess/users/'+result.user.uid).set({login:name,role:'viewer',status:'pending',mustChangePassword:false});
    }else await auth.signInWithEmailAndPassword(email,password);
   }catch(err){errors(err);}finally{b.disabled=false;}
  };
 }
 function changePassword(){
  show('<h2>Troque sua senha inicial</h2><p>Defina uma senha com pelo menos 12 caracteres, letras e números para liberar o acesso.</p><form><label>Nova senha<input name="password" type="password" minlength="12" maxlength="128" required autocomplete="new-password"></label><label>Confirme a senha<input name="confirm" type="password" required autocomplete="new-password"></label><button>Salvar nova senha</button></form>');
  button('Sair',exit,panel.querySelector('.access-card'));
  panel.querySelector('form').onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector('button');if(f.password.value!==f.confirm.value){message('As senhas precisam ser iguais.');return;}b.disabled=true;try{if(f.password.value.length<12||!/[a-zA-Z]/.test(f.password.value)||!/[0-9]/.test(f.password.value)) {message('Use pelo menos 12 caracteres, letras e números.');return;} await auth.currentUser.updatePassword(f.password.value);await db.ref('quapAccess/users/'+auth.currentUser.uid+'/mustChangePassword').set(false);await auth.currentUser.getIdToken(true);}catch(err){errors(err);}finally{b.disabled=false;}};
 }
 async function manage(){
  show('<h2>Integrantes e solicitações</h2><div id="access-users">Carregando…</div>');
  button('Voltar à ferramenta',()=>activate(profile),panel.querySelector('.access-card'));
  try{const snapshot=await db.ref('quapAccess/users').once('value'),list=document.getElementById('access-users');list.textContent='';
   snapshot.forEach(s=>{const u=s.val(),row=document.createElement('div');row.className='access-user';const title=document.createElement('p');title.textContent=u.login+' · '+(labels[u.role]||u.role)+' · '+({pending:'Aguardando aprovação',approved:'Aprovado',blocked:'Bloqueado'}[u.status]||u.status);row.append(title);
    if(u.role!=='senior'){const select=document.createElement('select');for(const role of ['viewer','analyst']){const o=document.createElement('option');o.value=role;o.textContent=labels[role];select.append(o);}select.value=u.role;row.append(select);
     const update=status=>async e=>{e.target.disabled=true;try{await db.ref('quapAccess/users/'+s.key).update({role:select.value,status});await manage();}catch(err){errors(err);e.target.disabled=false;}};
     button(u.status==='pending'?'Aprovar':'Salvar perfil',update('approved'),row);button('Bloquear',update('blocked'),row);
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
