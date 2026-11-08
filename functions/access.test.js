const test=require('node:test'),assert=require('node:assert/strict');
const {validPassword,canManage}=require('./policy');
test('senha inicial e senhas fracas não liberam acesso',()=>{
 for(const p of ['123456','abcdefghijkl','123456789012',null]) assert.equal(validPassword(p),false);
 assert.equal(validPassword('NovaSenha2026!'),true);
});
test('somente sênior aprovado que trocou senha gerencia terceiros',()=>{
 const a={role:'senior',status:'approved',mustChangePassword:false};
 assert.equal(canManage(a,'self','other','analyst','approved'),true);
 for(const patch of [{role:'analyst'},{role:'viewer'},{status:'blocked'},{mustChangePassword:true}]) assert.equal(canManage({...a,...patch},'self','other','viewer','approved'),false);
 assert.equal(canManage(a,'self','self','viewer','approved'),false);
 assert.equal(canManage(a,'self','other','senior','approved'),false);
});
