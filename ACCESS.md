# Login e controle de acesso

Implementação preparada para o Firebase `controlmaterials`, preservando a configuração e os dados do index.html recebido.

- Sênior: aprova, bloqueia e define analista ou visualizador.
- Analista: leitura e alteração dos registros operacionais.
- Visualizador: leitura; gravações são negadas nas regras do banco.
- Novos cadastros ficam pendentes e não leem os dados da ferramenta.
- A troca da senha inicial é confirmada no servidor antes de liberar o banco.
- Sessão encerrada ao fechar o navegador; botão Sair disponível.

## Ativação

1. Reconectar a conta administrativa do Firebase (`firebase login --reauth`).
2. Instalar dependências em `functions` com `npm install` e executar `npm test`.
3. Habilitar Email/Senha no Firebase Authentication do projeto correto.
4. Executar `node bootstrap.cjs` em functions, com `FIREBASE_TOOLS_PATH` apontando para a pasta `firebase-tools/lib`. O script usa a sessão administrativa local e não grava tokens ou senhas no banco.
5. **Antes de publicar as regras**, baixar as regras atuais do banco e combinar os caminhos `quapAccess` e `ferramentas/quap/matriz_competencias_v1` com as regras dos demais sistemas. Remover permissões públicas dos ancestrais desses caminhos: permissões concedidas em um ancestral não podem ser negadas no filho. O arquivo fornecido é uma base restritiva; não substituir as regras de um banco compartilhado sem revisar os demais caminhos.
6. Publicar as funções `changePassword` e `manageAccess` (Cloud Functions exige projeto com faturamento habilitado), depois as regras revisadas e os arquivos `index.html`, `auth.js` e `auth.css` juntos.
7. Verificar em navegador: os dois primeiros acessos e troca obrigatória; cadastro pendente sem leitura; aprovação como visualizador; tentativa direta de gravação negada; aprovação como analista e gravação; bloqueio com sessão aberta.

Usuários iniciais: `Ivan.Antoneli` e `Grabriela.Baptista`. Senha temporária solicitada: `123456`. O bootstrap não altera contas já existentes e falha se encontrar uma conta sem perfil, para evitar elevar privilégios de uma conta indevida. A grafia Grabriela foi preservada conforme o pedido.

Os identificadores internos terminam em `@users.quapsese.invalid`; não são endereços de contato. Login aceita letras, números, ponto, hífen e sublinhado, sem distinguir maiúsculas. Não há recuperação por e-mail nesta versão.

## Validação realizada

Testes de política cobrem senha inicial/fraca, aprovação e restrições por perfil, bloqueio, troca obrigatória, autopromoção e promoção para sênior. Verificação sintática dos scripts. A validação integrada e a ativação remota dependem da reconexão administrativa; não foram realizadas com a sessão expirada.
