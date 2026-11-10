# Controle de acesso — plano gratuito

A aplicação usa Firebase Authentication (Email/Senha) e Realtime Database no projeto `quapsese`. Não usa Cloud Functions nem exige plano Blaze.

| Perfil | Permissões |
|---|---|
| Sênior | Todas as consultas e alterações operacionais; cadastrar usuários, aprovar, bloquear e definir perfis Sênior, Analista ou Visualizador |
| Analista | Consultar, inserir, alterar e excluir dados operacionais |
| Visualizador | Consultar dados; gravações negadas no banco |
| Pendente/bloqueado | Sem acesso aos registros operacionais |

Usuários iniciais: `Ivan.Antoneli` e `Grabriela.Baptista`, com senha temporária solicitada `123456`. O espaço após o ponto foi removido. No primeiro acesso a tela exige uma senha de pelo menos 6 caracteres, permitindo apenas números. Nenhuma senha é guardada no banco de perfis ou no código publicado.

## Limite da troca inicial

Nesta implementação gratuita a aplicação primeiro aguarda a confirmação de `updatePassword` pelo Firebase Authentication e depois libera o perfil. As regras impedem o usuário de alterar seu perfil, aprovação ou privilégio, mas permitem que ele limpe seu próprio indicador de troca inicial. Portanto, esse indicador **não comprova no servidor que houve troca de senha**: um cliente modificado pode contornar a tela. A proteção de perfis e aprovação é independente e aplicada no servidor. Faça a troca das duas senhas temporárias imediatamente. A validação estrita do processo de troca exige um componente confiável de servidor.

## Publicação

Os arquivos fonte são `index.html`, `auth.js`, `auth.css`, `logo-original.png`, `logo-sese.png` e `neural-network.svg`. Copie os seis para `public/` antes de publicar. A pasta `public/` é gerada e ignorada pelo Git.

Com a conta administrativa conectada:

```
firebase deploy --only auth,database,hosting --project quapsese
```

As regras são exclusivas do projeto `quapsese`. Não publicar estas regras no banco compartilhado `controlmaterials`. Dados operacionais da versão anterior foram copiados para o mesmo caminho relativo no banco `quapsese`, mantendo a cópia original. A versão antiga que usa `controlmaterials` precisa ser substituída nos endereços de distribuição; sua cópia de dados e suas regras públicas não foram alteradas por afetarem um projeto compartilhado.

Identificadores internos terminam em `@users.quapsese.invalid`; são chaves de login, sem caixa postal. Não há recuperação por e-mail nesta versão. O Sênior pode cadastrar usuários diretamente e promover integrantes a Sênior. Seniores existentes não podem ser rebaixados ou bloqueados pela tela de gestão. O cadastro público foi removido e a criação de perfis no banco é exclusiva de seniores aprovados. As alterações solicitam novamente a senha do Sênior na interface.

## Publicação da alteração de perfis

É necessário publicar `firebase-database.rules.json` no projeto `quapsese`, além de atualizar `auth.js` no endereço usado pela equipe. Alterar apenas o GitHub não publica regras no Firebase. O Firebase Authentication pode aceitar contas sem perfil via API; elas não recebem acesso à ferramenta.

## Verificação anterior

Regras compiladas e publicadas. Testes reais com usuários temporários cobrem acesso anônimo, primeiro acesso dos seniores, solicitação pendente, negação de autoaprovação/autopromoção, leitura de visualizador, negação de sua gravação direta, gravação por analista e sênior, aprovação e bloqueio e revogação com sessão aberta. Os usuários temporários foram removidos. Login e tela de troca inicial também foram verificados no navegador, sem erros JavaScript.
