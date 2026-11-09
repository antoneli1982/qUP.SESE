# Controle de acesso

A aplicação usa Firebase Authentication (Email/Senha) e Realtime Database no projeto `quapsese`. A gestão de usuários desta versão depende da função `manageQuapUsers`, com Firebase Admin SDK no servidor. Nunca coloque credenciais administrativas no HTML.

| Perfil | Permissões |
|---|---|
| Sênior | Consultar e alterar dados; criar usuários; aprovar, bloquear, definir níveis e redefinir senhas de outros usuários |
| Analista | Consultar, inserir, alterar e excluir dados operacionais |
| Visualizador | Consultar dados; gravações negadas no banco |
| Pendente/bloqueado | Sem acesso aos registros operacionais |

## Gestão pelo sênior

Em **Gerenciar integrantes**, use **Criar usuário** para definir login, nível e senha temporária. Os níveis são Visualizador, Analista e Sênior. A conta é criada aprovada e exige troca de senha no primeiro acesso. Senhas aceitam de 6 a 128 caracteres, inclusive somente números. O servidor do Firebase também aplica a política de senhas configurada no projeto.

Cada criação, aprovação, bloqueio, mudança de nível e redefinição abre uma confirmação para digitar novamente a senha do sênior. A interface usa `reauthenticateWithCredential`; o servidor valida o token, sua revogação, autenticação nos últimos 60 segundos e o perfil atual no banco. Cancelar ou errar a senha não executa a alteração.

Use **Redefinir senha** para atribuir uma nova senha temporária. A senha anterior não é recuperada nem exibida. As senhas não são armazenadas no banco de perfis, nos logs ou no código. Informe a senha temporária ao destinatário por um canal apropriado.

A própria conta não pode ser gerenciada nessa tela. Seniores existentes são protegidos contra bloqueio e rebaixamento, inclusive por requisições diretas; outro sênior pode redefinir sua senha. Rebaixar um sênior exige administração do projeto.

## Troca inicial e sessões antigas

A redefinição fecha o acesso operacional antes de alterar a senha e revoga as sessões. O perfil registra somente o instante `passwordResetAt`, sem senha. As regras exigem autenticação posterior a esse instante, impedindo o uso de tokens antigos mesmo depois da conclusão da troca inicial.

A troca obrigatória passa pelo servidor. O cliente não pode mais limpar `mustChangePassword` diretamente. Depois da troca, o usuário entra novamente. Se uma redefinição falhar parcialmente, o acesso permanece fechado até nova tentativa; o sistema não anuncia sucesso.

Identificadores terminam em `@users.quapsese.invalid`; são chaves de login sem caixa postal. Não existe recuperação por e-mail nesta versão.

## Publicação coordenada obrigatória

**Esta versão não deve ser integrada à main nem publicada parcialmente antes de preparar o backend.** Cloud Functions exige projeto no plano Blaze, com faturamento habilitado. A documentação anterior descrevia uma versão sem Functions; essa condição muda aqui. Não habilitar faturamento automaticamente.

1. Com acesso administrativo autorizado ao projeto `quapsese`, confirme o plano e instale Firebase CLI e Node.js 22.
2. Na pasta `functions`, execute `npm ci` e `npm test`.
3. Publique primeiro o backend: `firebase deploy --only functions:manageQuapUsers --project quapsese`.
4. Prepare `public/` com `index.html`, `auth.js`, `auth.css`, `logo-original.png`, `logo-sese.png` e `neural-network.svg`.
5. Publique o frontend e as regras juntos, em janela de manutenção: `firebase deploy --only database,hosting --project quapsese`. Atualize também GitHub Pages integrando a alteração e solicite recarga das abas antigas. A versão anterior da troca inicial deixa de funcionar com as novas regras.
6. Valide em ambiente publicado, com usuários de teste: confirmação de senha incorreta/correta, criação nos três níveis, alteração de nível, bloqueio, redefinição, troca obrigatória e tentativa com sessão antiga.

As regras são exclusivas de `quapsese`. Não publicar no projeto compartilhado `controlmaterials`. Os dados operacionais mantêm os mesmos caminhos.

## Validação desta alteração

Os testes locais em `functions/management.test.js` usam Auth e banco simulados. Cobrem autorização, confirmação recente, entradas inválidas, criação e rollback, promoção, proteção de seniores, redefinição, revogação, falha parcial e troca obrigatória com sessão recente. Não substituem testes no Emulator Suite ou no ambiente publicado. Sintaxe JavaScript e whitespace também são verificados. Implantação e teste ponta a ponta no Firebase ainda pendentes.
