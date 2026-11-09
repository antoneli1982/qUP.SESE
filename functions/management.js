'use strict';
const roles = ['viewer', 'analyst', 'senior'];
const statuses = ['approved', 'blocked'];
function createManager({auth, db, HttpsError}) {
  const fail = (code, message) => { throw new HttpsError(code, message); };
  const passwordValid = p => typeof p === 'string' && p.length >= 6 && p.length <= 128;
  return async (actorUid, data, authTime) => {
    if (!actorUid) fail('unauthenticated', 'Entre novamente.');
    const actor = (await db.ref('quapAccess/users/' + actorUid).get()).val();
    if (actor?.passwordResetAt && (!authTime || authTime < actor.passwordResetAt))
      fail('unauthenticated', 'Entre novamente com a senha temporária.');
    if (data?.action === 'changeOwnPassword') {
      if (!actor || actor.status === 'blocked' || actor.mustChangePassword !== true)
        fail('permission-denied', 'Troca inicial não disponível para esta conta.');
      if (!passwordValid(data.password)) fail('invalid-argument', 'Use uma senha de 6 a 128 caracteres.');
      try {
        await auth.updateUser(actorUid, {password: data.password});
        await auth.revokeRefreshTokens(actorUid);
        await db.ref('quapAccess/users/' + actorUid + '/mustChangePassword').set(false);
        return {ok: true};
      } catch {
        fail('internal', 'Não foi possível concluir a troca. Entre novamente e tente outra vez.');
      }
    }
    if (!actor || actor.role !== 'senior' || actor.status !== 'approved' || actor.mustChangePassword !== false)
      fail('permission-denied', 'Somente um sênior com acesso liberado pode gerenciar usuários.');
    if (!Number.isFinite(authTime) || Date.now()/1000-authTime > 60 || authTime > Date.now()/1000+5)
      fail('unauthenticated', 'Confirme novamente sua senha para autorizar esta alteração.');
    if (!data || !['create', 'profile', 'resetPassword'].includes(data.action))
      fail('invalid-argument', 'Operação inválida.');
    try {
      if (data.action === 'create') {
        const login = typeof data.login === 'string' ? data.login.trim() : '';
        if (!/^[A-Za-z0-9._-]{3,64}$/.test(login) || !roles.includes(data.role) || !passwordValid(data.password))
          fail('invalid-argument', 'Confira o login, o nível e a senha de 6 a 128 caracteres.');
        const user = await auth.createUser({email: login.toLowerCase() + '@users.quapsese.invalid', password: data.password});
        try {
          await db.ref('quapAccess/users/' + user.uid).set({
            login, role: data.role, status: 'approved', mustChangePassword: true
          });
        } catch (error) {
          // Do not leave an orphaned account if profile creation fails.
          await auth.deleteUser(user.uid);
          throw error;
        }
        return {uid: user.uid};
      }
      if (typeof data.uid !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(data.uid))
        fail('invalid-argument', 'Usuário inválido.');
      if (data.uid === actorUid)
        fail('failed-precondition', 'Use outro sênior para alterar seu próprio acesso.');
      const ref = db.ref('quapAccess/users/' + data.uid);
      if (data.action === 'profile') {
        if (!roles.includes(data.role) || !statuses.includes(data.status))
          fail('invalid-argument', 'Nível ou situação inválidos.');
        // Transaction prevents a stale screen from downgrading a newly promoted senior.
        const result = await ref.transaction(current => {
          if (!current) return;
          if (current.role === 'senior' && (data.role !== 'senior' || data.status !== 'approved')) return;
          return {...current, role: data.role, status: data.status};
        });
        if (!result.committed)
          fail('failed-precondition', 'Usuário não encontrado ou sênior protegido contra bloqueio e rebaixamento.');
        return {ok: true};
      }
      if (!passwordValid(data.password))
        fail('invalid-argument', 'Use uma senha de 6 a 128 caracteres.');
      // Close operational access before changing Auth. A partial failure stays closed.
      const result = await ref.transaction(current => current ? {...current, mustChangePassword: true, passwordResetAt: Math.ceil(Date.now()/1000)} : undefined);
      if (!result.committed) fail('not-found', 'Usuário não encontrado.');
      await auth.updateUser(data.uid, {password: data.password});
      await auth.revokeRefreshTokens(data.uid);
      return {ok: true};
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      if (error.code === 'auth/email-already-exists') fail('already-exists', 'Este login já existe.');
      if (error.code === 'auth/user-not-found') fail('not-found', 'Conta não encontrada.');
      if (error.code === 'auth/password-does-not-meet-requirements' || error.code === 'auth/invalid-password')
        fail('invalid-argument', 'A senha não atende à política configurada no Firebase.');
      // Never log or return request data, which may contain a temporary password.
      fail('internal', 'Não foi possível concluir. Atualize a lista e tente novamente.');
    }
  };
}
module.exports = {createManager};
