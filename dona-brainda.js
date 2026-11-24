(function(){
'use strict';
/* Base de conhecimento da Dona Brainda — parte 1: primeiros passos, navegação, painel, colaboradores, setores */
const KB1 = [
{
  id: "oque-e", cat: "Primeiros passos", title: "O que é esta ferramenta",
  k: ["ferramenta","sistema","matriz","competencia","quap","sese","serve","objetivo","finalidade","proposito","funciona","visao geral do sistema","sobre"],
  p: ["o que e essa ferramenta","para que serve essa ferramenta","para que serve o sistema","pra que serve essa ferramenta","o que faz a ferramenta","como funciona a ferramenta","o que e o quap","o que e sese"],
  a: `A ferramenta é a **Matriz de Competências e Treinamentos do SESE (quAP)**. Ela serve para saber, em um só lugar, **quem está preparado para atuar em cada setor**.

Ela junta quatro coisas:
- **Colaboradores** (cadastro, matrícula, admissão, cargo, turno, responsável);
- **Setores** (áreas da operação, com atividades e cursos obrigatórios);
- **Cadastro de treinamentos** (catálogo único de cursos, com validade e tags);
- **Treinamentos realizados** (o histórico de quem fez o quê, e quando vence).

Com isso ela calcula sozinha a **aptidão por setor**, monta a **matriz de cursos** e a **Matriz Operacional** (as bolinhas de nível 0 a 3), avisa dos **vencimentos** e controla **afastamentos e reciclagem**. Tudo sincroniza em tempo real e pode ser levado para o **Excel**.`,
  rel: ["navegacao","primeiros-passos","visao-geral"]
},
{
  id: "navegacao", cat: "Primeiros passos", title: "Menu e telas da ferramenta",
  k: ["menu","aba","abas","tela","telas","navegar","navegacao","onde fica","onde esta","encontrar","lateral","barra"],
  p: ["quais telas","quais abas","como navegar","onde encontro","onde fica","menu lateral","para onde vou"],
  a: `O menu tem **seis telas**:

- **Visão geral** — painel com indicadores, cobertura e alertas de vencimento.
- **Gestão Estratégica** — encontrar pessoas qualificadas por área e oportunidades de atuação por pessoa.
- **Colaboradores** — lista da equipe, com busca, edição rápida e histórico.
- **Setores** — áreas, atividades, cursos obrigatórios e a Matriz de Competência de cada setor.
- **Cadastro de treinamentos** — o catálogo único de cursos.
- **Treinamentos realizados** — o histórico de realizações e as datas de renovação.

No topo ficam o **tema de cores**, o botão **Atualizar dados** e a barra do **Excel** (Baixar modelo, Importar Excel, Exportar Excel).`,
  rel: ["visao-geral","estrategica","tema","excel-exportar"]
},
{
  id: "primeiros-passos", cat: "Primeiros passos", title: "Por onde começar (ordem recomendada)",
  k: ["comecar","comeco","iniciar","inicio","primeiro","primeiros","passo","configurar","montar","comece por aqui","zero","novo","ordem"],
  p: ["por onde comeco","como comecar","comece por aqui","primeiros passos","ordem de cadastro","o que cadastro primeiro","montar a primeira matriz"],
  a: `A ordem que evita retrabalho:

1. **Cadastro de treinamentos** → cadastre os cursos (nome, tempo, validade em meses, tags).
2. **Setores** → crie os setores e marque os **cursos de pré-requisito** de cada um.
3. **Colaboradores** → cadastre as pessoas e escolha o setor de cada uma.
4. **Treinamentos realizados** → registre quem fez cada curso e quando.
5. **Setores → Matriz de Competência** → ajuste as colunas/ordem e imprima.

Se você já tem uma planilha, pule direto para **Importar Excel** (use antes o **Baixar modelo**). A ordem sugerida na planilha é a mesma: Departamentos → Atividades e Colaboradores → Avaliações e Treinamentos.

Se a tela estiver vazia, o painel mostra o cartão **“Comece por aqui”** com o botão **Criar setor**.`,
  rel: ["catalogo-criar","setor-criar","colab-criar","treino-registrar","excel-importar"]
},
{
  id: "visao-geral", cat: "Primeiros passos", title: "Visão geral (painel)",
  k: ["visao geral","painel","dashboard","indicador","indicadores","cobertura","grafico","resumo","home","cartao","cartoes","kpi"],
  p: ["o que significa cobertura","o que tem no painel","como ler o painel","cobertura de competencias","participacao de cada nivel","competencias por setor"],
  a: `A **Visão geral** mostra:

- **Cobertura de competências** — % de combinações *colaborador × atividade* avaliadas em **100%**. Clique para abrir a matriz.
- **Colaboradores** — quantas pessoas há na seleção atual.
- **Em treinamento** — competências no nível de **50%**.
- **Treinamentos registrados** — total do histórico (abre a tela de realizados).
- **Competências por setor** e **Participação de cada nível** — gráficos com 100% Apto, 50% Em treinamento e 0% Sem treinamento.
- **Atenção aos vencimentos** — quantos já venceram, vencem em até 7 dias (inclui hoje) e entre 8 e 30 dias.
- **Renovações no radar** — lista de treinamentos vencidos ou que vencem nos próximos 30 dias.

Use **Filtrar setor** para ver só uma área. Pessoas **afastadas** não entram nas contas.

> A nota do painel avisa: a validade do treinamento **não altera o nível da competência** nesses indicadores; ela só gera os alertas.`,
  rel: ["vencimento-cores","niveis-avaliacao","afastamento"]
},
{
  id: "estrategica", cat: "Primeiros passos", title: "Gestão Estratégica",
  k: ["gestao estrategica","estrategica","estrategia","qualificadas","qualificado","oportunidades","remanejar","remanejamento","quem pode atuar","substituir","substituto","cobrir"],
  p: ["quem pode atuar em","encontrar pessoas qualificadas","gestao estrategica"],
  a: `A tela **Gestão Estratégica** serve para duas perguntas:

1. **“Quem está qualificado em cada área?”**
2. **“Em quais áreas cada pessoa poderia atuar?”**

Ela usa os mesmos dados da matriz (considera “treinado” o **nível 2 ou mais**) e leva em conta o **estado de afastamento** das pessoas. Clicar em um setor abre a Matriz de Competência dele; clicar em uma pessoa abre o histórico.

Observação: essa tela vem de um módulo separado (*strategy.js*), então os detalhes visuais dela podem mudar sem afetar o resto da ferramenta. Para ver por pessoa quais setores ela já cumpre, você também pode usar **Colaboradores → Relação de treinamentos**.`,
  rel: ["relacao-treinamentos","matriz-operacional"]
},
{
  id: "demo", cat: "Primeiros passos", title: "Modo demonstração",
  k: ["demonstracao","demo","fictico","ficticios","teste","testar","treinar","simulacao","exemplo","explorar","brincar","voltar aos meus dados","usar meus dados"],
  p: ["modo demonstracao","dados ficticios","voltar aos meus dados","explorar demonstracao","como testar sem estragar"],
  a: `O **Modo demonstração** carrega **dados fictícios** para você explorar sem risco.

- Entre por **Explorar demonstração** (ou **Ver demonstração** quando houver erro de carregamento).
- Um aviso aparece no topo: *“Dados fictícios. As alterações aqui são temporárias.”*
- Tudo o que você fizer fica só na tela — **nada é gravado** no Firebase.
- Para sair, clique em **Usar meus dados** (ou **Voltar aos meus dados**): seus registros reais voltam.
- Se exportar o Excel na demonstração, o arquivo recebe **_DEMONSTRACAO** no nome.

É ótimo para treinar novos usuários.`,
  rel: ["sincronizacao","excel-exportar"]
},
{
  id: "tema", cat: "Primeiros passos", title: "Tema de cores (claro, escuro, colorido)",
  k: ["tema","cor","cores","escuro","claro","colorido","dark","modo escuro","aparencia","visual","noite"],
  p: ["mudar o tema","modo escuro","tema escuro","trocar cores","mudar a cor"],
  a: `Use **Tema de cores** (no topo, ao lado de “Gestão de pessoas”) e escolha entre **claro**, **escuro** e **colorido**.

A escolha fica salva **neste navegador** (não vai para o servidor), então cada pessoa/computador pode ter o seu tema.`,
  rel: ["navegacao"]
},
{
  id: "busca-dicas", cat: "Primeiros passos", title: "Como a busca funciona e dicas de uso",
  k: ["busca","buscar","pesquisar","pesquisa","procurar","filtro","filtrar","acento","paginacao","pagina","itens por pagina","ordenar","ordenacao","dica","dicas","atalho"],
  p: ["como pesquisar","como buscar","itens por pagina","ignora acento","dicas de uso","buscar por matricula"],
  a: `**Buscas** (todas ignoram acentos e maiúsculas):
- **Colaboradores:** por nome (e, nas telas de matriz, também por matrícula e cargo).
- **Treinamentos realizados e Cadastro:** por nome, descrição, pessoa ou **#tag**. Digitar várias palavras exige que **todas** apareçam.
- **Setores:** “Buscar setor pelo nome”.
- Dentro de modais de curso/pessoa: “Buscar por nome, matrícula, setor…”.

**Tags:** clique em uma tag para buscar por ela. No cadastro, separe as tags por vírgula (ex.: *segurança, integração, NR-35*).

**Listas:** escolha **Itens por página** (10, 50 ou 100) e navegue com Anterior/Próxima.

**Teclado:** **Esc** fecha os pop-ups de escolha de cursos. E, para falar comigo, aperte **?** (fora de campos de texto).`,
  rel: ["catalogo-tags"]
},

/* ---------- Colaboradores ---------- */
{
  id: "colab-criar", cat: "Colaboradores", title: "Cadastrar um colaborador",
  k: ["colaborador","colaboradores","funcionario","pessoa","operador","cadastrar","criar","novo","adicionar","incluir","cadastro","admissao","cargo","turno","responsavel","matricula"],
  p: ["novo colaborador","cadastrar colaborador","adicionar funcionario","como cadastrar uma pessoa","incluir colaborador","criar colaborador"],
  a: `Em **Colaboradores**, clique em **Novo colaborador**.

Campos:
- **Nome completo** (obrigatório, máx. 140 caracteres)
- **Setor** (obrigatório; é preciso ter ao menos um setor cadastrado)
- **Matrícula**, **Admissão**, **Cargo atual**, **Turno**, **Responsável**
- **Cursos de pré-requisito / treinamentos do colaborador** — marque os cursos que a pessoa já possui.

Regras que o sistema aplica:
- **Matrícula única** — “Já existe um colaborador com essa matrícula.”
- **Nome único** (sem diferenciar acentos/maiúsculas) — “Já existe um colaborador com esse nome.”

Depois de salvo, o colaborador aparece automaticamente na **matriz do setor escolhido**, com os pré-requisitos e as pendências daquela área.`,
  rel: ["colab-editar","colab-trocar-setor","treino-registrar"]
},
{
  id: "colab-editar", cat: "Colaboradores", title: "Editar dados de um colaborador (inclusive direto na tabela)",
  k: ["editar","alterar","corrigir","mudar","atualizar","trocar","modificar","dados","nome","matricula","cargo","turno","admissao","responsavel","chapa","celula","lapis"],
  p: ["como editar colaborador","alterar matricula","mudar cargo","corrigir nome","editar na tabela","mudar o turno","alterar admissao"],
  a: `Duas formas:

1. **Pelo formulário** — na linha do colaborador, use o ícone de **lápis (Editar)** e salve.
2. **Direto na tabela** — nas colunas de **nome, matrícula, chapa VW, admissão, cargo atual, turno e responsável** dá para editar a célula na própria linha (cada campo valida o que você digita).

Validações: o nome não pode ficar vazio nem repetir o de outra pessoa; a **matrícula** não pode repetir.

Se o seu perfil for **somente leitura**, a edição fica bloqueada (veja “Não consigo editar”).`,
  rel: ["colab-trocar-setor","somente-leitura","colab-excluir"]
},
{
  id: "colab-trocar-setor", cat: "Colaboradores", title: "Trocar um colaborador de setor",
  k: ["trocar setor","mudar setor","mover","transferir","transferencia","remanejar","novo setor","mudanca","outro setor","passar para"],
  p: ["trocar de setor","mudar de setor","transferir colaborador","mover colaborador para outro setor","o que acontece se mudar o setor"],
  a: `Edite o colaborador e escolha o **novo Setor**. O próprio formulário avisa:

> *Ao salvar, o colaborador passa para a matriz do novo setor, com os pré-requisitos e pendências dessa área. Seus treinamentos e níveis por curso são preservados.*

Ou seja: **nada do histórico se perde**. As capacitações acompanham a pessoa, e na matriz nova ela já aparece com o que cumpre e o que falta daquele setor.

Para tirar alguém de um setor sem destino definido, existe o setor especial **SEM SETOR** (também aparece como “Mover para SEM SETOR” ao excluir um setor).`,
  rel: ["setor-excluir","aptidao","matriz-cursos"]
},
{
  id: "colab-historico", cat: "Colaboradores", title: "Histórico de desenvolvimento do colaborador",
  k: ["historico","perfil","desenvolvimento","ficha","detalhe","detalhes","abrir pessoa","treinamentos da pessoa","registro","linha do tempo"],
  p: ["ver historico","historico do colaborador","abrir perfil","ver treinamentos de uma pessoa","historico de desenvolvimento"],
  a: `Clique no **nome do colaborador** (em Colaboradores ou nas matrizes) para abrir o **Histórico de desenvolvimento**.

Ali você vê todos os treinamentos da pessoa (nome, tempo, data, vencimento, situação), pode **registrar um novo**, **editar** ou **excluir** registros e abrir **Afastamentos e reciclagem**.

Se o histórico estiver vazio, aparece “Histórico ainda vazio — registre o primeiro treinamento deste colaborador.”`,
  rel: ["treino-registrar","afastamento","relacao-treinamentos"]
},
{
  id: "relacao-treinamentos", cat: "Colaboradores", title: "Relação de treinamentos (onde a pessoa pode atuar)",
  k: ["relacao","relacao de treinamentos","onde pode atuar","pode atuar","faltam cursos","falta","setores","porcentagem","apto para","quais setores"],
  p: ["onde ela pode atuar","o que falta para atuar","relacao de treinamentos e porcentagem por setor","em quais setores a pessoa pode trabalhar","o que falta para um setor"],
  a: `Em **Colaboradores**, o ícone de **relação** (“Relação de treinamentos e % por setor”) abre duas partes:

**1. Onde ela pode atuar** — lista os setores com a porcentagem:
> cursos exigidos pelo setor que a pessoa já fez (e estão **em dia**) ÷ total de cursos exigidos.

**2. O que falta para um setor** — escolha o setor e veja **quais cursos faltam** (ou **vencidos**). Se tudo estiver em dia aparece “**Pode atuar**”; senão, “**Faltam cursos**”.

Só entram setores que têm cursos de pré-requisito cadastrados.`,
  rel: ["aptidao","setor-prereq"]
},
{
  id: "colab-excluir", cat: "Colaboradores", title: "Excluir um colaborador",
  k: ["excluir","apagar","remover","deletar","lixeira","eliminar","desligado","desligamento","demitido","saiu"],
  p: ["excluir colaborador","apagar funcionario","remover pessoa","colaborador saiu da empresa","deletar colaborador"],
  a: `Use o ícone de **lixeira (Excluir)** na linha do colaborador e confirme.

⚠️ **Atenção — a ação não pode ser desfeita** e leva junto:
- as **avaliações**,
- todos os **treinamentos** registrados,
- os **afastamentos** dessa pessoa
(e os níveis manuais por curso).

Antes de excluir, vale **Exportar Excel** para ter um backup. Se a pessoa só está afastada (férias, licença), **não exclua**: use **Afastamentos e reciclagem**, assim o histórico é mantido.`,
  rel: ["afastamento","excel-exportar"]
},
{
  id: "colab-cursos-possui", cat: "Colaboradores", title: "Marcar cursos que o colaborador já possui (sem data)",
  k: ["cursos que possui","ja possui","ja fez","concluiu","sem data","cadastro","marcar curso","antigo","legado","no cadastro","pre requisito do colaborador","preencher"],
  p: ["marcar curso que ele ja fez","curso sem data","no cadastro","pre requisito do colaborador","curso antigo sem registro"],
  a: `No formulário do colaborador, a seção **“Cursos de pré-requisito / treinamentos do colaborador”** deixa marcar cursos do catálogo que a pessoa **já possui**, mesmo sem uma data de realização.

- Na **matriz de cursos** eles aparecem como ✓ com o texto **“No cadastro”**.
- Na **Matriz Operacional** contam como curso válido sem data (nível automático **2**).
- Quando você registrar o treinamento de verdade (com data), o registro passa a valer no lugar.

Dica: o formulário avisa “Os cursos já cadastrados estão marcados. Marque um curso que falta para preencher o treinamento.”`,
  rel: ["matriz-cursos","matriz-operacional","treino-registrar"]
},

/* ---------- Setores e atividades ---------- */
{
  id: "setor-criar", cat: "Setores e atividades", title: "Criar um setor",
  k: ["setor","setores","departamento","area","carta","criar","novo","cadastrar","adicionar","incluir"],
  p: ["novo setor","criar setor","cadastrar departamento","como criar uma area","adicionar setor"],
  a: `Em **Setores**, clique em **Novo setor**.

- **Nome do setor** — obrigatório e **único** (não diferencia maiúsculas): “Já existe um setor com esse nome.”
- **Descrição** (opcional).
- **Cursos de pré-requisito do setor** — marque os cursos obrigatórios. *Cada curso selecionado aparece automaticamente na matriz para todos os colaboradores do setor, com a capacitação já registrada ou a pendência.*

Cada cartão de setor mostra: quantas pessoas há (ícone de pessoa), o botão **Matriz de Competência**, os **cursos de pré-requisito** e as **atividades do setor**. Dá para buscar setores por nome no topo da tela.`,
  rel: ["setor-prereq","atividade-criar","matriz-operacional"]
},
{
  id: "setor-prereq", cat: "Setores e atividades", title: "Cursos de pré-requisito do setor",
  k: ["pre requisito","prerequisito","pre-requisito","requisito","obrigatorio","obrigatorios","exigido","exigidos","curso obrigatorio","global","excluir pre requisito","remover requisito"],
  p: ["curso de pre requisito","como definir pre requisito","cursos obrigatorios do setor","remover pre requisito","cursos exigidos pelo setor","tirar curso global de um setor","remover curso global do setor","excecao de curso global","setor nao exige o curso global","como definir o que o setor exige"],
  a: `Os **pré-requisitos** são os cursos que o setor **exige**. Eles definem as colunas obrigatórias da matriz e o cálculo da **aptidão**.

**Como definir:** edite o setor e marque os cursos (há busca; use o botão **+** para selecionar vários de uma vez). Também dá para usar **“Cadastrar treinamento na matriz de competências”** no cartão do setor.

**De onde vêm:**
- os que você marcou no setor;
- os cursos do catálogo marcados como **Global** (valem para **todos** os setores automaticamente);
- vínculos antigos por setor (importados da aba *Treinamentos_Departamentos*).

**Para tirar um curso Global de um setor específico:** edite o setor e desmarque o curso (ele vem marcado com “· Global”). O setor guarda isso como exceção.

**Dica de seleção:** na edição há busca (“Buscar curso pelo nome…”) e os botões **Selecionar resultados** e **Desmarcar resultados** para marcar vários de uma vez.

Um curso exigido que a pessoa não fez aparece como **✕ Pendente** (matriz de cursos) e fica no **nível 0** (Matriz Operacional).`,
  rel: ["catalogo-global","aptidao","matriz-cursos"]
},
{
  id: "setor-excluir", cat: "Setores e atividades", title: "Excluir um setor",
  k: ["excluir setor","apagar setor","remover setor","deletar setor","excluir departamento","sem setor","sem departamento","mover colaboradores"],
  p: ["excluir setor","apagar departamento","o que acontece se excluir um setor","mover para sem setor"],
  a: `Ao excluir um setor, o sistema pergunta o que fazer com as pessoas dele:

- **Mover para “SEM SETOR”** (padrão) — as pessoas continuam cadastradas e com histórico.
- **Mover para outro setor** da lista.
- **Excluir também os colaboradores** (apaga pessoas, treinamentos, avaliações e afastamentos).

Também são excluídas as **atividades** do setor e as **avaliações** ligadas a elas. O aviso final lembra: *“Esta ação não pode ser desfeita.”*

Faça um **Exportar Excel** antes, por segurança.`,
  rel: ["colab-trocar-setor","excel-exportar"]
},
{
  id: "atividade-criar", cat: "Setores e atividades", title: "Atividades do setor",
  k: ["atividade","atividades","tarefa","processo","posto","criar atividade","nova atividade","adicionar atividade","excluir atividade"],
  p: ["nova atividade","criar atividade","o que e atividade","atividades do setor","adicionar tarefa ao setor"],
  a: `**Atividades** são os processos/tarefas que se avalia dentro de um setor (ex.: um posto de trabalho).

- Em **Setores**, no bloco **ATIVIDADES DO SETOR**, use **Adicionar atividade** (ou **Nova atividade**).
- O **nome é único dentro do setor**: “Esta atividade já existe no setor.”
- Excluir uma atividade apaga também as **avaliações** ligadas a ela.

As atividades alimentam os indicadores da **Visão geral** (cobertura, em treinamento). Já a **matriz de cursos** e a **Matriz Operacional** são baseadas em **cursos**, não em atividades.`,
  rel: ["niveis-avaliacao","visao-geral"]
},
{
  id: "niveis-avaliacao", cat: "Setores e atividades", title: "Avaliação por atividade (0%, 50%, 100%)",
  k: ["avaliacao","avaliar","avaliacoes","nivel","niveis","percentual","0%","50%","100%","apto","em treinamento","sem treinamento","conhecimento","avaliar competencia"],
  p: ["avaliar competencia","niveis de conhecimento","o que significa 50%","o que e 100% apto","como avaliar uma atividade"],
  a: `A avaliação por atividade usa **três níveis**:

- **0% — Sem treinamento**
- **50% — Em treinamento**
- **100% — Apto para exercer o processo**

O formulário **Avaliar competência** pede o **Nível de conhecimento** (campo obrigatório) e a **Data da avaliação** (campo obrigatório). Existe **uma avaliação por par colaborador + atividade** (salvar de novo substitui a anterior). Combinação sem avaliação conta como **0%**.

Observações importantes:
- O treinamento **é registrado separadamente** no histórico — ele não muda a avaliação automaticamente.
- Nesta versão da tela, o formulário abre a partir do **histórico da pessoa** quando há uma atividade consultada. Para lançar muitas avaliações de uma vez, o caminho mais prático é a aba **Avaliacoes** do Excel (colunas: ID_Colaborador, ID_Atividade, Nivel_Percentual 0/50/100, Data).`,
  rel: ["visao-geral","excel-regras","atividade-criar"]
},
{
  id: "setor-pessoas", cat: "Setores e atividades", title: "Ver quem está no setor",
  k: ["quem esta no setor","pessoas do setor","equipe do setor","integrantes","membros","ver equipe","icone de pessoa","lista de pessoas"],
  p: ["quem esta no setor","ver equipe do setor","pessoas do setor","quantas pessoas tem no setor"],
  a: `No cartão de cada setor há um **ícone de pessoa com um número** — é a quantidade de colaboradores. Clique nele para abrir **“Quem está no setor”**, uma lista rápida da equipe, com atalho para abrir a lista completa em **Colaboradores** já filtrada.

Na tela **Colaboradores**, o link **“Abrir o setor”** faz o caminho inverso e leva ao cartão do setor da pessoa.`,
  rel: ["setor-criar","colab-historico"]
}
];

/* Base de conhecimento da Dona Brainda — parte 2: treinamentos, vencimentos, matrizes, afastamentos */
const KB2 = [
/* ---------- Cadastro de treinamentos (catálogo) ---------- */
{
  id: "catalogo-oque", cat: "Treinamentos", title: "Cadastro de treinamentos (catálogo)",
  k: ["catalogo","cadastro de treinamentos","treinamento geral","curso","cursos","base unica","modelo de curso","template","lista de cursos"],
  p: ["o que e o cadastro de treinamentos","para que serve o catalogo","treinamento geral","diferenca entre cadastro e realizado","catalogo de cursos"],
  a: `O **Cadastro de treinamentos** é a **base única de cursos** da empresa — “uma base única de treinamentos para setores e colaboradores”.

Cada curso do catálogo tem: **nome**, **descrição**, **tempo total** (HH:MM), **validade em meses**, **tags** e a marcação **Global**.

**Diferença importante:**
- **Cadastro de treinamentos** = o curso em si (o “molde”).
- **Treinamentos realizados** = o registro de que **uma pessoa fez** aquele curso numa data.

Os setores usam o catálogo para definir pré-requisitos, e os registros de realização apontam para ele. Cursos com o **mesmo nome** são tratados como o **mesmo curso** (o sistema unifica duplicados).`,
  rel: ["catalogo-criar","treino-registrar","setor-prereq"]
},
{
  id: "catalogo-criar", cat: "Treinamentos", title: "Cadastrar ou editar um treinamento geral",
  k: ["cadastrar treinamento","novo treinamento","criar curso","novo curso","treinamento geral","editar treinamento","editar curso","validade","validade em meses","tempo total","descricao","horas"],
  p: ["novo treinamento geral","cadastrar curso","criar treinamento","como criar um curso","editar um curso do catalogo"],
  a: `Em **Cadastro de treinamentos**, clique em **Novo treinamento geral** (ou no lápis para editar).

- **Nome** — obrigatório (máx. 140). **Não pode repetir:** “Já existe um treinamento com esse nome.” (o sistema oferece abrir o existente).
- **Descrição** — opcional (até 3000 caracteres).
- **Tempo total** — formato **HH:MM**, ex.: **02:30** = 2h30. Pode ficar em branco. Para mais de 24 horas use algo como **40:00**. Minutos de 00 a 59.
- **Validade (meses)** — deixe em branco se o curso **não vence**.
- **Tags de pesquisa** — separadas por vírgula (ex.: *segurança, integração, NR-35*).
- **Global** — veja o tópico “Treinamento Global”.

Na lista, você vê **quantas pessoas** fizeram cada curso; o botão de “quem fez” abre os nomes e o de “cadastrar várias pessoas” registra o curso em lote.`,
  rel: ["catalogo-global","catalogo-lote","catalogo-excluir","catalogo-tags"]
},
{
  id: "catalogo-global", cat: "Treinamentos", title: "Treinamento Global",
  k: ["global","todos os setores","todos os departamentos","vincular automaticamente","vinculo automatico","obrigatorio para todos","integracao"],
  p: ["o que e treinamento global","vincular a todos os departamentos","curso para todos os setores","desativar vinculo automatico"],
  a: `Marcar um treinamento como **Global** significa **“Vincular automaticamente a todos os departamentos”**: ele vira **pré-requisito de todos os setores** de uma vez (ideal para integração, segurança geral etc.).

- Na lista do catálogo ele aparece com o selo **✓ Global**.
- Para desligar, use **“Desativar vínculo automático com todos os departamentos”**.
- Se um setor específico **não** deve exigir o curso global, **edite o setor**: os cursos globais vêm marcados com a etiqueta **“· Global”**; desmarque o curso ali e ele fica como **exceção** daquele setor.

Cuidado: tornar global um curso com muitos requisitos muda a **aptidão de todo mundo** (a % de cada setor passa a incluir esse curso).`,
  rel: ["setor-prereq","aptidao"]
},
{
  id: "catalogo-tags", cat: "Treinamentos", title: "Tags dos treinamentos",
  k: ["tag","tags","etiqueta","hashtag","#","palavra chave","categoria","classificar"],
  p: ["como usar tags","o que sao tags","buscar por tag","pesquisar por tag","filtrar por tag","separar tags","cadastrar tags"],
  a: `**Tags** são etiquetas para achar cursos rapidamente (ex.: #segurança, #NR-35).

- Cadastre separando por **vírgula** (também vale ponto e vírgula ou quebra de linha). O “#” inicial é opcional.
- Tags repetidas (mesmo ignorando acento/maiúscula) são unificadas.
- No catálogo aparece **“Buscar por tag”**: clicar na tag filtra a lista.
- Na busca, você pode digitar **#tag** junto com outras palavras.
- Ao registrar uma realização, as tags do curso vêm junto e são gravadas no registro.`,
  rel: ["busca-dicas","catalogo-criar"]
},
{
  id: "catalogo-excluir", cat: "Treinamentos", title: "Excluir um treinamento do catálogo",
  k: ["excluir treinamento","apagar curso","remover curso","deletar treinamento","em uso","nao consigo excluir","historico preservado"],
  p: ["nao consigo excluir treinamento","excluir curso do catalogo","este treinamento esta em uso","remover treinamento"],
  a: `O sistema **só deixa excluir** um treinamento do catálogo se ele **não estiver em uso**. Caso contrário aparece:

> *“Este treinamento está em uso. Remova os pré-requisitos e vínculos antes de excluir; o histórico precisa ser preservado.”*

“Em uso” significa que ele está em **algum registro de realização**, ou é **pré-requisito de um setor ou de um colaborador**, ou tem vínculo de setor.

**Como liberar:** retire o curso dos pré-requisitos dos setores e dos colaboradores. Se já existem registros de realização, o curso **não pode ser apagado** (para não perder o histórico) — nesse caso, apenas deixe de usá-lo.`,
  rel: ["setor-prereq","catalogo-criar"]
},
{
  id: "catalogo-lote", cat: "Treinamentos", title: "Registrar um curso para várias pessoas de uma vez",
  k: ["varias pessoas","em lote","lote","cadastrar pessoas","turma","varios colaboradores","todos","quem fez","quem fez este curso","confirmar","adicionar todos"],
  p: ["cadastrar varias pessoas","registrar turma","lancar treinamento em lote","quem fez este curso","registrar curso para todos","registrar muita gente no mesmo curso","varias pessoas no mesmo curso","varios colaboradores no mesmo curso","turma inteira","onde vejo quem fez o curso"],
  a: `No **Cadastro de treinamentos**, cada curso tem dois atalhos:

- **“Ver quem fez”** — lista as pessoas que já fizeram (com data e vencimento).
- **“Cadastrar várias pessoas neste curso”** — abre a tela **Cadastrar pessoas**: você define **Realizado em**, **Tempo total (HH:MM)** e **Vencimento**, busca por **nome, matrícula ou setor**, filtra por setor e clica **Adicionar** em cada pessoa — ou **Confirmar** para adicionar **todos os listados** de uma vez.

O contador mostra “1 pessoa registrada” / “N pessoas registradas”. Se alguém já tiver o curso naquela data, o sistema não duplica.`,
  rel: ["treino-registrar","catalogo-oque"]
},

/* ---------- Treinamentos realizados ---------- */
{
  id: "treino-registrar", cat: "Treinamentos", title: "Registrar um treinamento realizado",
  k: ["registrar","registro","realizacao","realizado","lancar","lancamento","treinamento realizado","fez o curso","concluiu","registrar realizacao","data de realizacao","cadastrar treinamento"],
  p: ["registrar realizacao","como registrar treinamento","lancar curso feito","registrar que a pessoa fez o curso","novo registro de treinamento"],
  a: `Em **Treinamentos realizados**, clique em **Registrar realização** (ou use **+ Adicionar treinamento** no histórico da pessoa).

Preencha:
- **Colaborador** — pela **Matrícula do colaborador** (quando abre pela tela geral) ou já vinculado, se abriu pelo histórico.
- **Nome do treinamento** — ao digitar, aparecem sugestões do catálogo; escolher uma **preenche descrição, tempo, tags e vencimento**. Se o nome não existir, o curso **é criado no catálogo** automaticamente.
- **Data de realização** (obrigatória, **não pode ser futura**).
- **Tempo total (HH:MM)** — opcional.
- **Vencimento** — **automático** (data + meses de validade do curso). Se o curso não tem validade, só aparece se você editar um registro que já tenha vencimento.
- **Origem e aprovação:** **interno**, **externo** ou **homologado**.

Bloqueios: a data não pode ser futura; o vencimento não pode ser anterior à data; e não pode haver **mesmo colaborador + mesmo curso + mesma data** duplicados.`,
  rel: ["treino-origem","vencimento-calculo","treino-renovar","treino-filtros"]
},
{
  id: "treino-origem", cat: "Treinamentos", title: "Interno, externo e homologado",
  k: ["interno","externo","homologado","homologacao","origem","aprovacao","aprovado","checkbox","terceiro","fornecedor"],
  p: ["o que e homologado","diferenca entre interno e externo","treinamento homologado","origem do treinamento"],
  a: `Cada realização tem uma **origem**:

- **Treinamento interno** — dado dentro da empresa.
- **Treinamento externo** — feito fora (consultoria, escola, fornecedor).
- **Treinamento homologado** — **realizado externamente e aprovado internamente**.

Regras (o sistema ajusta sozinho as caixas):
- **Interno e externo não podem estar marcados juntos.**
- Ao marcar **homologado**, o **externo** é marcado automaticamente (e o interno é desmarcado).
- Desmarcar **externo** também desmarca **homologado**.

Se algo ficar inconsistente, aparece “Confira a origem e a homologação do treinamento”. No Excel: *Homologado exige Externo=Sim e Interno=Não*.`,
  rel: ["treino-registrar","excel-regras"]
},
{
  id: "treino-renovar", cat: "Treinamentos", title: "Renovar um treinamento vencido",
  k: ["renovar","renovacao","reciclar","refazer","novo registro","vencido","atualizar treinamento","revalidar","reciclagem do curso"],
  p: ["como renovar treinamento","treinamento venceu o que fazer","renovacao de curso","refazer o curso"],
  a: `**Renovar = registrar um novo treinamento.** Não edite o antigo: faça um **novo registro** com a nova data de realização.

O rodapé da tela de realizados explica: *“O histórico é mantido: registre uma renovação como um novo treinamento.”*

O sistema considera sempre o **registro mais recente** de cada curso para decidir se a pessoa está **em dia** ou **vencida**. Assim o histórico anterior continua guardado e o status é atualizado na hora.

No Excel vale a mesma regra: a renovação é uma nova linha com **outro ID**.`,
  rel: ["treino-registrar","vencimento-cores"]
},
{
  id: "treino-filtros", cat: "Treinamentos", title: "Filtros e ordenação em Treinamentos realizados",
  k: ["filtro","filtros","filtrar","ordenar","ordenacao","situacao do vencimento","alertas","colaborador","setor","atencao","todas as situacoes","sem vencimento","em dia"],
  p: ["filtrar por vencimento","ver so os vencidos","ordenar treinamentos","ver treinamentos de um setor","situacao do vencimento","quem vence nos proximos 30 dias","ver o que vence","listar vencidos","lista de vencimentos"],
  a: `Em **Treinamentos realizados** use a barra de filtros:

- **Filtrar setor** — todos ou um setor.
- **Todos os colaboradores** — escolha uma pessoa.
- **Situação do vencimento:** *Todas as situações · Vencidos e próximos 30 dias · Vencidos · Até 7 dias · De 8 a 30 dias · Em dia (mais de 30 dias) · Sem vencimento*.
- **Busca** por treinamento, pessoa ou #tag.
- **Ordenar:** *Colaborador (A–Z)*, *Ordem de vencimento*, *Realizado: mais recente primeiro* ou *mais antigo primeiro*.
- **Itens por página:** 10, 50 ou 100.

Atalho: clicar nos cartões de alerta da **Visão geral** já abre esta tela com o filtro de “atenção” aplicado.

Cada linha tem **Editar** (lápis) e **Excluir** (lixeira) e mostra a **Situação** com cor.`,
  rel: ["vencimento-cores","visao-geral"]
},

/* ---------- Vencimentos ---------- */
{
  id: "vencimento-cores", cat: "Vencimentos", title: "Situações e cores do vencimento",
  k: ["vencimento","vencimentos","vence","vencer","vencido","validade","cor","cores","semaforo","vermelho","laranja","amarelo","verde","alerta","alertas","prazo","expirar","expirado","em dia","dias","7 dias","30 dias"],
  p: ["o que significam as cores","quando vence","vence em breve","situacao do treinamento","como funciona o vencimento","treinamento vencido"],
  a: `A situação é calculada pela **data de vencimento** comparada com **hoje (fuso de Brasília)**:

- 🔴 **Vencido** — vencimento já passou.
- 🟠 **Vence hoje / Em até 7 dias** — laranja.
- 🟡 **Em 8 a 30 dias** — âmbar.
- 🟢 **Em dia** — mais de 30 dias.
- ⚪ **Sem vencimento** — curso sem validade.

A conta é atualizada **a cada minuto** na tela. Na matriz de cursos, “vence em até 30 dias” aparece como ✓ com aviso; vencido vira **!**.

Lembre: a validade **gera alertas**, mas nos indicadores de avaliação (0/50/100%) ela **não muda o nível** da atividade. Já na **aptidão** e na **Matriz Operacional**, um curso **vencido não conta** como feito.`,
  rel: ["vencimento-calculo","aptidao","treino-renovar"]
},
{
  id: "vencimento-calculo", cat: "Vencimentos", title: "Como o vencimento é calculado",
  k: ["calculo","calcular","data de vencimento","meses","validade em meses","automatico","automatica","vencimento automatico","somar","fim do mes","dia"],
  p: ["como e calculado o vencimento","vencimento automatico","data de vencimento automatica","validade em meses como funciona"],
  a: `**Vencimento = data de realização + validade (em meses) do curso.**

- Se o curso tem validade, o campo de vencimento é **automático** e fica somente leitura (“Vencimento calculado pela data de realização + N mês(es) de validade do curso.”).
- Se o mês de destino for mais curto, vale o **último dia do mês** (ex.: 31/01 + 1 mês → 28/02 ou 29/02).
- Se o curso **não tem validade**, o vencimento fica **vazio** (“Sem vencimento”).
- O vencimento **nunca** pode ser anterior à data do treinamento.

Dica: para mudar o prazo de vários registros, ajuste a **Validade (meses)** no curso do catálogo antes de lançar novas realizações.`,
  rel: ["vencimento-cores","catalogo-criar"]
},

/* ---------- Matrizes e aptidão ---------- */
{
  id: "diferenca-matrizes", cat: "Matrizes e aptidão", title: "Diferença entre aptidão, matriz de cursos e Matriz Operacional",
  k: ["diferenca","diferencas","comparar","qual","tipos de matriz","matrizes","aptidao","matriz de cursos","matriz operacional","polivalencia","tres","varias matrizes"],
  p: ["qual a diferenca entre as matrizes","diferenca entre aptidao e matriz","quais matrizes existem","tipos de matriz","matriz de cursos x matriz operacional"],
  a: `São **três visões** dos mesmos dados:

1. **Aptidão por setor** — um **percentual** por pessoa e setor: *cursos exigidos em dia ÷ cursos exigidos*. Responde “essa pessoa pode atuar no setor?”.
2. **Matriz de competências por cursos** — tabela **colaborador × curso** de cada setor, com ✓ / ! / ✕ / —. Mostra pré-requisitos **e** os outros cursos que a equipe tem.
3. **Matriz Operacional (Matriz de Competência do setor)** — o **documento oficial** com bolinhas de **nível 0 a 3**, assinaturas, mês de emissão e **impressão/PDF** (código F-05BR-SCA-241 Rev.00).

Resumo: **aptidão** = nota; **matriz de cursos** = conferência; **Matriz Operacional** = documento para imprimir e assinar.`,
  rel: ["aptidao","matriz-cursos","matriz-operacional"]
},
{
  id: "aptidao", cat: "Matrizes e aptidão", title: "Aptidão por setor (cálculo)",
  k: ["aptidao","apto","parcial","pendente","porcentagem","percentual","%","nota","cumpre","pode atuar","pre requisitos cumpridos","sem pre requisitos"],
  p: ["como e calculada a aptidao","o que e aptidao","apto parcial pendente","porque a aptidao nao e 100","aptidao por setor"],
  a: `**Aptidão por setor** = (cursos exigidos pelo setor que a pessoa tem **em dia**) ÷ (total de cursos exigidos) × 100.

Legenda do painel:
- 🟢 **100% · Apto**
- 🟡 **50–99% · Parcial**
- 🔴 **0–49% · Pendente** (o rótulo de quem tem 1–49% aparece como “Parcial”, mas na cor vermelha)

Detalhes:
- Setor **sem pré-requisitos** mostra “Sem pré-requisitos” (sem %).
- Curso **vencido não conta**; vale o registro **mais recente** de cada curso.
- Cursos “no cadastro” (marcados sem data) contam como possuídos.
- **Afastados** não aparecem na tabela.
- A tabela mostra o detalhe “3/5 cursos · Parcial” e uma barra de progresso, com paginação de 10, 50 ou 100.`,
  rel: ["matriz-cursos","vencimento-cores","setor-prereq"]
},
{
  id: "matriz-cursos", cat: "Matrizes e aptidão", title: "Matriz de competências por cursos (✓ ! ✕ —)",
  k: ["matriz de cursos","matriz por cursos","simbolos","legenda","possui","vence em ate 30 dias","vencido","pendente","nao possui","tabela","colaborador por curso","check","x"],
  p: ["o que significam os simbolos","legenda da matriz","matriz de competencias por cursos","o que e o x na matriz","o que e o ! na matriz","x vermelho na matriz","simbolo x na matriz","o que significa o x","check verde na matriz","simbolos da matriz"],
  a: `A **Matriz de competências por cursos** tem uma tabela por setor: **colaboradores × cursos**. Primeiro vêm os **pré-requisitos** do setor; depois os **outros cursos** que a equipe possui.

Legenda:
- **✓ Possui** — tem o curso em dia (ou “No cadastro”).
- **✓ Vence em até 30 dias** — em dia, mas perto do vencimento.
- **! Vencido** — mostra a data do vencimento.
- **✕ Pré-requisito pendente** — o setor exige e a pessoa não tem.
- **— Não possui** — curso extra que a pessoa não fez (não é exigido).

Recursos: pesquisa por **nome, matrícula ou cargo**, **Exibir por página**, e o cabeçalho de cada curso mostra “quantos têm / total”. **Afastados ficam ocultos.** Quem está com **reciclagem pendente** aparece sinalizado no cargo.`,
  rel: ["aptidao","afastamento","matriz-operacional"]
},
{
  id: "matriz-operacional", cat: "Matrizes e aptidão", title: "Matriz Operacional / Matriz de Competência do setor",
  k: ["matriz operacional","matriz de competencia","matriz do setor","polivalencia","bolinha","bolinhas","bola","nivel 0","nivel 1","nivel 2","nivel 3","documento","treinado","multiplicado","em treinamento","nao executa","ordem das colunas","arrastar","assinatura"],
  p: ["como abrir a matriz do setor","abrir matriz de competencia","matriz operacional","o que significam as bolinhas","niveis 0 1 2 3","como funciona a matriz de competencia","quem aprovou a matriz","elaborado por","verificado por","aprovado por","assinatura da matriz","data de emissao","data de revisao","onde coloco o aprovador"],
  a: `Abra em **Setores → Matriz de Competência** (botão grande no cartão do setor). É a tabela oficial **“MATRIZ OPERACIONAL — TREINAMENTOS”** do setor:

- Colunas: **Matrícula · Nome · Admissão** + um **curso por coluna**.
- Linhas: colaboradores ordenados pela **admissão** (e nome).
- Cada célula tem uma **bolinha** que mostra o nível:

| Nível | Significado |
|---|---|
| **0** | Não executa atividade |
| **1** | Em treinamento |
| **2** | Treinado |
| **3** | Treinado / multiplicado |

Em baixo ficam a **legenda**, os campos **Elaborado por / Verificado por / Aprovado por**, **Data de emissão** e **Data de revisão** (o mês da matriz vem da data de emissão) e o código **F-05BR-SCA-241 – Rev.00**.

Use o seletor de setor no topo para trocar de matriz, **Escolher cursos** para montar as colunas e **Imprimir / PDF** para gerar o documento.`,
  rel: ["matriz-nivel-auto","matriz-nivel-manual","matriz-escolher-cursos","matriz-imprimir"]
},
{
  id: "matriz-nivel-auto", cat: "Matrizes e aptidão", title: "Como o nível automático (bolinha) é calculado",
  k: ["nivel automatico","automatico","90 dias","91 dias","dias desde o curso","calculo do nivel","por que nivel 1","por que nivel 2","por que nivel 0","bolinha vazia","bolinha pela metade","tempo desde o curso"],
  p: ["como e calculado o nivel","por que esta nivel 1","por que a bolinha esta vazia","nivel automatico pelos dias","90 dias nivel 1"],
  a: `Se ninguém ajustou manualmente, o nível sai **do tempo desde o primeiro treinamento da pessoa no curso**:

- **Nível 0** — a pessoa **não fez** o curso, ou o curso está **vencido**.
- **Nível 1** — fez há **até 90 dias**.
- **Nível 2** — fez há **91 dias ou mais** (e o curso está em dia).
- Curso **marcado no cadastro, sem data** → nível **2**.

Células **vencidas** ficam destacadas, e passando o mouse você vê o motivo (ex.: “curso vencido em 10/03/2026” ou “automático: 42 dias desde o curso”).

O **nível 3 (treinado / multiplicado)** nunca é automático: só entra por **ajuste manual**.`,
  rel: ["matriz-nivel-manual","matriz-operacional","vencimento-cores"]
},
{
  id: "matriz-nivel-manual", cat: "Matrizes e aptidão", title: "Ajustar o nível manualmente",
  k: ["nivel manual","manual","ajustar nivel","definir nivel","trocar nivel","mudar bolinha","multiplicador","multiplicado","voltar para automatico","seletor da celula","forcar"],
  p: ["como mudar o nivel de uma bolinha","definir nivel manualmente","nivel 3 multiplicador","voltar ao automatico","ajustar a bolinha"],
  a: `Cada célula da Matriz Operacional tem um **seletor** (clique na bolinha):

- **“Automático pelos dias desde o curso (nível N)”** — volta ao cálculo automático.
- **0 – Não executa atividade**
- **1 – Em treinamento**
- **2 – Treinado**
- **3 – Treinado / multiplicado**

Ao escolher um nível fixo, a célula fica marcada como **manual** e **não muda** mais com o passar dos dias. É assim que você registra um **multiplicador** (nível 3).

Os ajustes manuais ficam guardados por **colaborador + curso**, vão para o Excel na aba **Niveis_Cursos** (valores 0 a 3) e **sobrevivem** a troca de setor.

Se o seu perfil for somente leitura, os seletores ficam desativados.`,
  rel: ["matriz-nivel-auto","somente-leitura","excel-regras"]
},
{
  id: "matriz-escolher-cursos", cat: "Matrizes e aptidão", title: "Escolher e ordenar os cursos (colunas) da matriz",
  k: ["escolher cursos","colunas","ordenar colunas","ordem","reordenar","mover coluna","setas","arrastar","incluir curso","adicionar curso","curso adicional","remover coluna","cursos da matriz"],
  p: ["como escolher os cursos da matriz","mudar a ordem das colunas","adicionar curso na matriz","remover curso da matriz","arrastar coluna","a matriz nao mostra o curso","falta curso na matriz","o curso nao aparece na matriz operacional","incluir curso na matriz","coluna que eu quero"],
  a: `Na Matriz Operacional, clique em **Escolher cursos**:

- À esquerda: o **Cadastro de treinamentos** (com busca por nome ou #tag; **Marcar os listados** / **Desmarcar adicionais**).
- À direita: as **Colunas da matriz**, na ordem. Use **↑ ↓** para reordenar e **✕** para remover.
- Os **pré-requisitos do setor** aparecem sempre e **não podem ser removidos aqui** — para tirá-los, edite o setor.
- Clique **Salvar cursos da matriz**.

**Reordenar direto na matriz:** arraste o **nome do curso** no cabeçalho para outra coluna, ou use **← →**. A ordem é salva automaticamente (aparece “Salvando ordem…”).

Se o catálogo está vazio, cadastre os cursos primeiro.`,
  rel: ["setor-prereq","matriz-operacional","catalogo-criar"]
},
{
  id: "matriz-imprimir", cat: "Matrizes e aptidão", title: "Imprimir ou salvar a matriz em PDF",
  k: ["imprimir","impressao","pdf","exportar pdf","salvar pdf","papel","a4","documento","emitir","gerar documento","assinar"],
  p: ["como imprimir a matriz","gerar pdf da matriz","salvar matriz em pdf","imprimir matriz operacional"],
  a: `Na **Matriz Operacional**, clique em **Imprimir / PDF**. O navegador abre a janela de impressão com o **nome sugerido** no padrão *“Matriz Operacional - Setor X - MÊS ANO”*. Escolha **Salvar como PDF** ou a impressora.

Antes de imprimir, preencha **Elaborado por, Verificado por, Aprovado por, Data de emissão e Data de revisão** — o mês no documento vem da **data de emissão** (sem data, fica “—”).

A Dona Brainda e o painel não saem na impressão.`,
  rel: ["matriz-operacional"]
},

/* ---------- Afastamentos ---------- */
{
  id: "afastamento", cat: "Afastamentos", title: "Afastamentos e reciclagem",
  k: ["afastamento","afastado","afastada","ferias","licenca","atestado","inss","maternidade","reciclagem","45 dias","retorno","voltou","oculto","escondido","pendente","reciclagem pendente"],
  p: ["como registrar afastamento","pessoa de ferias","reciclagem pendente","45 dias","afastado some da matriz","registrar licenca"],
  a: `Em **Colaboradores**, use **Afastar** ou **Retornar à ativa**. Em **Colaboradores afastados**, escolha uma pessoa ativa para registrar o afastamento ou abra o retorno na linha de quem já está afastado. Pelo histórico, abra **Afastamentos e reciclagem** (“Controle de presença na matriz de competências”).

**Registrar:** informe **Data do início do afastamento** e, se quiser, **Observação**. Enquanto não há data de fim, o status é **“Afastamento em andamento”** e a pessoa fica **oculta** nas matrizes (“Afastado · oculto na matriz”).

**No retorno:** informe **Data do fim do afastamento**.

**Regra dos 45 dias:** afastamentos **acima de 45 dias** deixam a pessoa com **“Reciclagem pendente”** (em vermelho) até você marcar **Reciclagem realizada** e informar a data. **Exatamente 45 dias não gera alerta.**

Outras regras: só pode haver **um afastamento em andamento**; períodos **não podem se sobrepor**; as datas **não podem ser futuras**; a reciclagem exige afastamento encerrado e data **igual ou posterior** ao fim. O histórico de afastamentos fica sempre listado.`,
  rel: ["afastamento-efeitos","matriz-cursos","excel-regras"]
},
{
  id: "afastamento-efeitos", cat: "Afastamentos", title: "Onde o afastado aparece (e onde some)",
  k: ["afastado some","nao aparece","oculto","onde aparece","indicadores","contagem","conta","efeitos","some da matriz","sumiu"],
  p: ["por que o colaborador sumiu da matriz","afastado aparece na matriz","afastado conta nos indicadores","onde o afastado aparece"],
  a: `Com um **afastamento em andamento**, a pessoa:

- **some** da **Matriz de cursos**, da **Aptidão por setor** e da **Gestão Estratégica**;
- **não conta** nos indicadores da **Visão geral** nem no total de “treinados”;
- **continua** cadastrada, com todo o histórico, e aparece na lista de **Colaboradores** com a etiqueta **“Afastado · oculto na matriz”**;
- fica fora das linhas e das contagens da **Matriz Operacional** até o retorno.

Quando você informa a data de fim, ela volta; se o afastamento passou de **45 dias**, volta com **“Reciclagem pendente”** até a reciclagem ser registrada.`,
  rel: ["afastamento","colab-nao-aparece"]
}
];

/* Base de conhecimento da Dona Brainda — parte 3: Excel, dados, lista oficial, problemas, glossário, sobre mim */
const KB3 = [
/* ---------- Excel ---------- */
{
  id: "excel-exportar", cat: "Excel", title: "Exportar para Excel (backup)",
  k: ["exportar","exportacao","baixar","download","backup","salvar","excel","xlsx","planilha","copia","levar os dados","gerar planilha"],
  p: ["exportar excel","como fazer backup","baixar planilha","salvar os dados","gerar excel com os dados"],
  a: `Clique em **Exportar Excel** (barra do Excel, no topo). Sai um arquivo **quAP_Competencias_AAAA-MM-DD.xlsx** (na demonstração, com **_DEMONSTRACAO** no nome) com **todas as abas de cadastro**:

*Departamentos, Atividades, Colaboradores, Avaliacoes, Treinamentos, Treinamentos_Gerais, Treinamentos_Departamentos, Afastamentos, Matriz_Departamentos, Niveis_Cursos* e a aba de orientações *Instrucoes*.

Use como **backup offline** — o próprio rodapé lembra: *“Exporte o Excel quando quiser um backup offline.”* Faça isso **antes** de importar, de excluir setores/pessoas ou de aplicar a lista oficial.

O botão fica desativado enquanto os dados estão carregando ou se houve erro de carga.`,
  rel: ["excel-importar","excel-modelo","excel-regras"]
},
{
  id: "excel-modelo", cat: "Excel", title: "Baixar o modelo de planilha",
  k: ["modelo","template","planilha vazia","modelo vazio","baixar modelo","preencher","exemplo de planilha","layout"],
  p: ["baixar modelo","onde pego o modelo da planilha","planilha modelo","modelo excel vazio"],
  a: `**Baixar modelo** gera o arquivo **quAP_Modelo_Excel.xlsx**: as mesmas abas e colunas da exportação, **vazias**, com a aba **Instrucoes** explicando o preenchimento.

Atenção especial na aba **Colaboradores**: as **duas primeiras linhas são ignoradas**, os **títulos ficam na linha 3** e os registros começam na **linha 4** (ou, alternativamente, registros desde a linha 3 na ordem das sete colunas). As outras abas têm título na primeira linha.

**Mantenha os nomes das abas.** Colunas extras fora do modelo são ignoradas.`,
  rel: ["excel-importar","excel-regras"]
},
{
  id: "excel-importar", cat: "Excel", title: "Importar uma planilha (3 modos)",
  k: ["importar","importacao","subir","carregar","upload","planilha","excel","sincronizar","substituir","adicionar","atualizar","modo de importacao","confirmar importacao","revisar"],
  p: ["como importar excel","subir planilha","importar colaboradores","modo de importacao","substituir todos os dados","adicionar atualizar pelo id","sincronizar colaboradores","importei e sumiram pessoas","depois de importar sumiram colaboradores","importacao apagou colaboradores","editar o excel e subir de volta"],
  a: `Clique em **Importar Excel**, escolha o arquivo (.xlsx ou .xls). A ferramenta lê, mostra um resumo para **revisar antes de aplicar** e só grava quando você clica em **Confirmar importação**.

**Modo de importação:**

1. **Atualizar lista de colaboradores** é o modo padrão para uma lista de pessoal. Para cada ativo ausente, escolha **Afastar** ou **Excluir cadastro e histórico**. Se um afastado reaparecer, escolha **Voltar à ativa** ou **Manter afastado**. A ferramenta pede todas as decisões antes de salvar. Quem continua afastado e fora da lista permanece com seu histórico.
2. **Adicionar / atualizar pelo ID** — atualiza registros com o **mesmo ID** e mantém todos os outros.
3. **Substituir todos os dados** — troca **tudo** pelo conteúdo da planilha (exige confirmação: **Confirmar substituição**). **Exporte uma cópia antes.**

Na demonstração a importação é só temporária.`,
  rel: ["excel-regras","excel-exportar","excel-modelo"]
},
{
  id: "excel-regras", cat: "Excel", title: "Regras de preenchimento da planilha",
  k: ["regras","preencher","preenchimento","id","ids","formato","data","datas","aaaa-mm-dd","nivel percentual","carga horaria","obrigatorios","colunas","abas","formula","formulas","erro ao importar","vinculos","referencia"],
  p: ["regras da planilha","como preencher o excel","formato da data na planilha","campos obrigatorios do excel","erro ao importar planilha","ids unicos"],
  a: `**Regras da aba Instrucoes (resumo):**

- **IDs únicos:** D001 setor · A001 atividade · C001 colaborador · T001 treinamento. Não reutilize ID de outro registro.
- **Vínculos:** ID_Departamento → aba Departamentos; ID_Colaborador → Colaboradores; ID_Atividade → Atividades.
- **Datas:** *AAAA-MM-DD* (2026-09-27), *DD/MM/AAAA* ou data válida do Excel.
- **Níveis de avaliação:** Nivel_Percentual **0, 50 ou 100** (aceita células formatadas como %).
- **Níveis de curso (Niveis_Cursos):** de **0 a 3**; os demais são calculados pelos dias (até 90 dias = 1, 91+ = 2).
- **Carga horária:** opcional; número maior que zero (ex.: 1,5 = 1h30).
- **Vencimento:** opcional; igual ou posterior à data do treinamento.
- **Marcações** Interno / Externo / Homologado: **Sim** ou **Não** (homologado exige Externo=Sim e Interno=Não).
- **Cursos_Pre_Requisito:** IDs de cursos do catálogo **separados por ponto e vírgula**.
- **Afastamentos:** Início e Fim em AAAA-MM-DD; Fim vazio = em andamento (oculto na matriz); >45 dias = reciclagem pendente até Reciclagem_Realizada=Sim + Data_Reciclagem.
- **Obrigatórios:** Departamentos: ID, Nome · Atividades: ID, ID_Departamento, Nome · Colaboradores: Nome e Matrícula · Avaliacoes: todos · Treinamentos: ID, ID_Colaborador, Titulo, Data.
- **Sem fórmulas:** as abas de importação devem ter **valores**.
- **Importação parcial:** mantenha só as abas desejadas.
- Avaliações usam a dupla **colaborador + atividade** como chave.`,
  rel: ["excel-importar","excel-modelo"]
},

/* ---------- Dados e sincronização ---------- */
{
  id: "sincronizacao", cat: "Dados e sincronização", title: "Sincronização em tempo real (Firebase)",
  k: ["sincronizacao","sincronizar","firebase","tempo real","usuario","usuarios","ao mesmo tempo","simultaneo","simultaneos","dois usuarios","online","nuvem","servidor","dados sincronizados","salvar","salvamento","gravacao","automatico","onde ficam os dados","multiusuario","varias pessoas","outro dispositivo","conflito"],
  p: ["onde ficam os dados","os dados sao salvos automaticamente","como funciona a sincronizacao","dados sincronizados","varias pessoas usando ao mesmo tempo"],
  a: `Os dados ficam no **Firebase Realtime Database** e **sincronizam em tempo real** entre todos que abrem a ferramenta. Cada alteração é salva ao concluir a ação (aparece “Alterações salvas e sincronizadas no Firebase”). O indicador **“Dados sincronizados”** fica no topo.

**Controle de conflito:** cada gravação confere a **revisão** dos dados. Se outra pessoa alterou ao mesmo tempo, aparece:
> *“Os registros foram alterados em outro dispositivo ou aba. Os dados mais recentes foram preservados. Feche o formulário e tente novamente.”*

Nada se perde: é só refazer a ação já com os dados atualizados.

O botão **Atualizar dados** (ícone de recarregar) força nova leitura. A ferramenta também guarda um **backup local** no navegador e, se o servidor estiver vazio, migra esse backup para o Firebase.`,
  rel: ["somente-leitura","erro-carregar","excel-exportar"]
},
{
  id: "somente-leitura", cat: "Dados e sincronização", title: "Perfil somente leitura / não consigo editar",
  k: ["somente leitura","leitura","permissao","permissoes","perfil","acesso","nao consigo editar","botao desativado","desabilitado","bloqueado","sem acesso","nao deixa","cinza","login","entrar","autenticacao"],
  p: ["nao consigo editar","botao desativado","por que nao consigo salvar","meu perfil permite somente leitura","sem permissao para alterar","botoes cinza","nao consigo salvar nada","nao salva nada"],
  a: `Se os botões estão cinza ou você vê *“Seu perfil permite somente leitura.”*, é **controle de acesso**: o login define quem pode **gravar** e quem só **consulta**. Peça a quem administra o acesso para liberar a edição.

Outras causas comuns de botões desativados:
- **Dados ainda carregando** (“Carregando seus registros…”) — aguarde.
- **Erro de carga/sincronização** — use **Tentar novamente** ou **Atualizar dados**.
- **Outra operação em andamento** — “Aguarde a operação anterior.”
- Você está no **Modo demonstração**: edita, mas só temporariamente.

Em somente leitura você ainda consegue **navegar, pesquisar, imprimir a matriz e exportar o Excel**.`,
  rel: ["erro-carregar","demo","sincronizacao"]
},
{
  id: "erro-carregar", cat: "Problemas comuns", title: "Não carrega / erro de Firebase / tela em branco",
  k: ["erro","falha","problema","nao carrega","carregando","tela branca","em branco","firebase","conexao","internet","offline","nao abre","travou","lento","tentar novamente","sdk","regras do realtime database"],
  p: ["nao foi possivel carregar os dados","a ferramenta nao abre","tela em branco","erro de conexao","nao foi possivel abrir a ferramenta","sincronizacao interrompida"],
  a: `Mensagens e o que fazer:

- **“Não foi possível carregar os dados do Firebase. Verifique a conexão e as regras do Realtime Database.”** → confira a internet e clique em **Tentar novamente**; se continuar, o problema costuma estar nas **regras/permissões do banco** (fale com o administrador).
- **“A sincronização com o Firebase foi interrompida.”** → conexão caiu; recarregue a página.
- **“O SDK do Firebase não carregou.”** → o navegador bloqueou os scripts do Google; libere-os ou troque de rede.
- **“Os dados recebidos do Firebase têm formato inválido.”** → algum registro quebrou a validação; avise o responsável técnico (os dados **não são apagados**).
- **“Não foi possível abrir a ferramenta.”** → reabra no **Chrome ou Edge atualizado**; os dados gravados não foram apagados.

Enquanto isso, **Ver demonstração** deixa você explorar com dados fictícios. Seus dados reais continuam seguros no servidor.`,
  rel: ["sincronizacao","somente-leitura","demo"]
},
{
  id: "lista-oficial", cat: "Dados e sincronização", title: "Lista oficial de mão de obra (MO)",
  k: ["lista oficial","mao de obra","mo","265","32 setores","cadastro refeito","aplicar lista oficial","deixar apenas","banner","refazer cadastro","oficial","folha","quadro"],
  p: ["o que e a lista oficial","aplicar lista oficial","por que meus colaboradores sumiram","lista oficial mo","cadastro refeito","deixar apenas os colaboradores da lista"],
  a: `A ferramenta traz embutida uma **lista oficial de mão de obra** (referência atual: *MO 16/10/2026 — 265 colaboradores, 32 setores*). O cadastro deve conter **somente** essas pessoas, sem duplicadas e usando **matrícula** (sem chapa VW).

Quando o cadastro difere da lista aparece o banner **“Lista oficial …”** com **Ver detalhes** e o botão de aplicar (**“Deixar apenas os N colaboradores”**). Aplicar:
- **casa** cada pessoa por matrícula, chapa ou nome (aceita pequenas diferenças de grafia);
- **ajusta nome, cargo, turno, admissão, responsável e setor** pela lista;
- **cria** os setores que faltam, **elimina** quem não está na lista e **une duplicados**;
- **baixa um backup Excel** antes de gravar;
- mostra o resumo **“Lista oficial aplicada”**.

A lista histórica só é aplicada por uma ação manual. Para atualizar a equipe com uma planilha nova, use **Importar Excel**.`,
  rel: ["excel-importar","colab-excluir","excel-exportar"]
},

/* ---------- Problemas comuns ---------- */
{
  id: "colab-nao-aparece", cat: "Problemas comuns", title: "Colaborador não aparece na matriz / lista",
  k: ["nao aparece","sumiu","sumiram","desapareceu","nao encontro","nao esta","falta","nao vejo","cade","onde esta o colaborador","faltando","oculto"],
  p: ["colaborador nao aparece na matriz","nao aparece na lista","cade o colaborador","por que nao vejo a pessoa","pessoa sumiu da matriz","nao encontro o colaborador","meus colaboradores sumiram","os colaboradores sumiram","colaboradores desapareceram"],
  a: `Confira, nesta ordem:

1. **Afastamento em andamento?** Afastados ficam **ocultos** nas matrizes de cursos/aptidão. Veja **Afastamentos e reciclagem**.
2. **Setor certo?** A pessoa só aparece na matriz **do setor dela**. Procure no setor **SEM SETOR**.
3. **Filtros:** em **Filtrar setor** deixe “Todos os setores” e limpe a busca.
4. **Paginação:** use **Itens por página** (50/100) ou a pesquisa.
5. **Matriz de aptidão:** só entram pessoas que têm **ao menos um curso** registrado.
6. **Importação de colaboradores:** confira a página **Colaboradores afastados** e a escolha feita ao atualizar a lista. A exclusão confirmada remove o histórico.

Se nada disso explicar, atualize os dados (**Atualizar dados**) — outra pessoa pode ter alterado o cadastro.`,
  rel: ["afastamento-efeitos","lista-oficial","colab-trocar-setor"]
},
{
  id: "curso-nao-conta", cat: "Problemas comuns", title: "O curso foi feito mas aparece pendente/vencido/nível 0",
  k: ["zero","pendente","vencido","nao conta","nao aparece o curso","curso nao reconhecido","nivel 0","mesmo fez","ja fez","errado","nome diferente","duplicado","nao bate","apto 0"],
  p: ["a pessoa fez o curso mas aparece pendente","por que o curso aparece vencido","curso nao esta contando","por que o nivel esta 0","por que o nivel esta zero","nivel zero na matriz","aptidao nao e 100","por que nao aparece o treinamento na matriz","a pessoa fez o curso mas aparece vermelho"],
  a: `Causas mais comuns:

- **O registro mais recente venceu.** O sistema olha só o **último** registro de cada curso. Se ele passou da validade, o curso fica **vencido** (!) — registre a **renovação**.
- **Nome do curso diferente.** A ligação é pelo **curso do catálogo**; sem vínculo, vale o **mesmo nome** (ignorando acento/maiúscula). Um nome ligeiramente diferente vira **outro curso**. Corrija escolhendo o curso do catálogo.
- **Curso não é pré-requisito do setor** (aparece em “outros cursos” com — ou nem aparece na Matriz Operacional, que mostra só as colunas escolhidas).
- **Pessoa em outro setor** ou **afastada**.
- **Data futura** não é aceita no registro.
- Na **Matriz Operacional**, um **nível manual** vale mais que o automático — veja o seletor da célula (pode estar em 0).

Passe o mouse na bolinha ou no ✓/!/✕: o texto explica o motivo.`,
  rel: ["matriz-nivel-auto","treino-renovar","vencimento-cores","aptidao"]
},
{
  id: "erro-salvar", cat: "Problemas comuns", title: "Mensagens de erro ao salvar (e o que fazer)",
  k: ["erro ao salvar","mensagem","ja existe","duplicado","duplicada","invalido","invalida","nao foi possivel salvar","confira os dados","data invalida","nao pode ser futura","sobrepostos","repetido"],
  p: ["mensagens de erro","ja existe um colaborador","ja existe um setor","data nao pode ser futura","nao consigo salvar","afastamentos sobrepostos","o que significa essa mensagem"],
  a: `As mensagens que mais aparecem:

- **“Já existe um colaborador com essa matrícula / esse nome.”** → pesquise antes; edite o existente.
- **“Já existe um setor com esse nome.”** / **“Esta atividade já existe no setor.”** / **“Já existe um treinamento com esse nome.”** → os nomes são únicos.
- **“Registre a data em que o treinamento foi realizado (não pode ser futura).”** → use a data real.
- **“O vencimento deve ser igual ou posterior ao treinamento.”** → corrija o vencimento.
- **“Este colaborador já possui esse treinamento nessa data.”** → registro duplicado.
- **“Não foi encontrado colaborador com essa matrícula.”** / **“Há mais de um colaborador com essa matrícula.”** → confira a matrícula.
- **“Informe o tempo no formato HH:MM, como 02:30.”** → minutos de 00 a 59.
- **“Já existe um afastamento em andamento.”** → encerre o atual antes de abrir outro.
- **“Afastamentos sobrepostos…”** / **“Confira as datas do afastamento.”** → ajuste as datas (nenhuma pode ser futura).
- **“Confira a origem e a homologação do treinamento.”** → veja interno/externo/homologado.
- **“Carregue seus dados antes de fazer alterações.”** → espere a carga terminar.`,
  rel: ["treino-registrar","afastamento","treino-origem"]
},

/* ---------- Glossário ---------- */
{
  id: "glossario", cat: "Glossário", title: "Glossário rápido",
  k: ["glossario","termo","termos","vocabulario","dicionario","sigla","siglas","definicao"],
  p: ["glossario","lista de termos","significado das siglas","vocabulario da ferramenta","o que e chapa vw","chapa vw","o que e mo","o que e quap"],
  a: `- **Matriz de competências** — quadro que cruza pessoas × cursos/atividades e mostra quem está preparado.
- **Setor (departamento/área)** — agrupamento de pessoas e atividades.
- **Atividade** — processo avaliado dentro do setor (0/50/100%).
- **Curso / treinamento geral** — item do **catálogo**.
- **Treinamento realizado** — registro de uma pessoa ter feito um curso numa data.
- **Pré-requisito** — curso exigido por um setor.
- **Global** — curso exigido por **todos** os setores.
- **Aptidão** — % de pré-requisitos do setor cumpridos e em dia.
- **Nível (0–3)** — grau na Matriz Operacional (não executa · em treinamento · treinado · treinado/multiplicado).
- **Vencimento / validade** — data limite / prazo em meses do curso.
- **Homologado** — feito externamente e aprovado internamente.
- **Reciclagem** — retreino exigido após afastamento acima de 45 dias.
- **Tag** — etiqueta de busca (#segurança).
- **MO** — lista oficial de mão de obra.
- **Chapa VW** — número de crachá; o cadastro usa a **matrícula**.
- **Modo demonstração** — dados fictícios temporários.
- **quAP** — nome da ferramenta no topo (“quAP · COMPETÊNCIAS”).`,
  rel: ["oque-e","diferenca-matrizes"]
},

/* ---------- Segurança / dados ---------- */
{
  id: "seguranca", cat: "Dados e sincronização", title: "Segurança, privacidade e o que a Dona Brainda guarda",
  k: ["seguranca","privacidade","lgpd","dados pessoais","privado","confidencial","enviar","internet","armazena","guarda","historico do chat","espionar","brainda guarda"],
  p: ["a dona brainda guarda minhas perguntas","meus dados estao seguros","a brainda envia dados","privacidade da ferramenta","lgpd"],
  a: `**Sobre a Dona Brainda:** ela funciona **inteiramente no seu navegador**. Não envia suas perguntas a lugar nenhum, não lê os registros de pessoas e não consulta o Firebase. Ela só **explica a ferramenta**.

O que fica guardado **neste navegador**: a conversa da sessão e, se você clicar em 👎, a pergunta que não consegui responder (para você poder copiar e mandar ao responsável). O botão **Limpar conversa** apaga a conversa; **Menu → Perguntas sem resposta** permite copiar/limpar essa lista.

**Sobre os dados da ferramenta:** ficam no Firebase da organização; quem pode **editar** e quem só **consulta** é definido pelo controle de acesso. Para tirar uma cópia, use **Exportar Excel** (contém dados pessoais — guarde com cuidado).`,
  rel: ["sincronizacao","somente-leitura","sobre-brainda"]
}
];

/* Base de conhecimento da Dona Brainda — parte 4: sobre a Brainda + atalhos de contexto */
const KB4 = [
{
  id: "sobre-brainda", cat: "Sobre a Dona Brainda", title: "Quem é a Dona Brainda e o que ela sabe",
  k: ["brainda","dona brainda","brendi","dona brendi","quem e voce","quem e vc","voce","assistente","ia","inteligencia artificial","robo","bot","cerebro","ajuda","ajudar","o que voce sabe","o que voce faz","como te uso","como usar o chat","limitacoes","nao sabe"],
  p: ["quem e voce","quem e a dona brainda","quem e a dona brendi","o que voce sabe fazer","o que voce faz","como te perguntar","voce e uma ia","como funciona a brainda","ajuda"],
  a: `Eu sou a **Dona Brainda**, o “cérebro” desta ferramenta 🧠. Tiro dúvidas **funcionais** (como fazer cada coisa) e **gerais** (o que cada termo significa, por que algo aparece de um jeito).

**Eu sei explicar:** colaboradores, setores e atividades, cadastro de treinamentos, treinamentos realizados, vencimentos, aptidão, matriz de cursos, Matriz Operacional, afastamentos e reciclagem, Excel (modelo, exportar, importar), sincronização, lista oficial, demonstração, tema, mensagens de erro e glossário.

**Como perguntar:** escreva do seu jeito (“como troco alguém de setor?”, “por que a bolinha está vazia?”). Se eu errar o tópico, use os botões de sugestão ou reformule com outras palavras.

**Meus limites:** eu rodo **só no seu navegador** e conheço as **regras e telas**; **não vejo os registros** das pessoas, não altero nada por você e não substituo o responsável pelo acesso/administração dos dados.`,
  rel: ["primeiros-passos","glossario","seguranca"]
}
];
KB4.push({
  id: "limites", cat: "Dados e sincronização", title: "Limites e tamanhos máximos",
  k: ["limite","limites","maximo","maxima","quantos","quantidade","capacidade","tamanho","caracteres","cabe","no maximo","teto"],
  p: ["quantos setores posso ter","quantos colaboradores cabem","limite de colaboradores","limite de caracteres","tamanho maximo","quantos cursos posso cadastrar","capacidade da ferramenta"],
  a: `Os limites que a ferramenta valida ao salvar:

- **Setores:** até **200**.
- **Colaboradores:** até **2.000**.
- **Atividades:** até **2.000** · **Avaliações:** até **20.000**.
- **Cadastro de treinamentos (catálogo):** até **10.000** cursos.
- **Treinamentos realizados:** até **10.000** registros.
- **Afastamentos:** até **20.000**.
- **Colunas (cursos) por matriz de setor:** até **300**.
- **Textos:** nomes até **140** caracteres; descrição do setor/atividade até **1.000**; descrição do curso até **3.000**; observação de afastamento até **1.000**; **tags** até **30** por curso (60 caracteres cada).
- **Tempo total do curso:** até **10000:00** horas (formato HH:MM).

Se bater em um limite, a gravação é recusada com uma mensagem de dados inválidos. Nesse caso, exporte o Excel e revise o que pode ser consolidado.`,
  rel: ["excel-exportar","erro-salvar"]
});

/* Dona Brainda — motor de compreensão (offline, sem dependências) */
const BraindaEngine = (function () {
  const KB = [].concat(KB1, KB2, KB3, KB4);
  const byId = {};
  KB.forEach(t => { byId[t.id] = t; });

  const STOP = new Set(("a o as os um uma uns umas de do da dos das em no na nos nas num numa por pra para com sem e ou que como qual quais onde quando " +
    "eu me meu minha meus minhas voce vc ve ele ela se ser sao esta estao estou tem tenho ter faz fazer faco fazem posso pode podem isso isto esse essa esses essas " +
    "aqui la mais muito muita ja ao aos ate ha foi era sobre entre mas so tambem preciso precisa quero queria gostaria saber sei nao nem tipo ai ta to vou vai " +
    "seria seu sua seus suas alguem algo gente por favor porque pq pois entao la ne ah eh oi ola mesmo ainda cada qualquer todo toda ficou fica ficar vez vezes " +
    "da de coisa coisas jeito forma maneira dentro fora favor ajuda ajudar explique explica explicar significa significam significado serve servem").split(/\s+/));
  /* "ajuda/explica" saem do vocabulário de busca para não puxar o tópico "sobre a Brainda" à toa */

  const SYN = {};
  function syn(canon, list) { list.split(/\s+/).forEach(w => { SYN[w] = canon; }); }
  syn("colaborador", "funcionario funcionarios empregado empregados operador operadores pessoa pessoas colaboradora colaboradoras integrante integrantes equipe time trabalhador");
  syn("treinamento", "curso cursos capacitacao capacitacoes treino treinos aula aulas qualificacao formacao");
  syn("setor", "departamento departamentos area areas secao carta cartas linha");
  syn("excel", "planilha planilhas xls xlsx");
  syn("importar", "subir carregar upload anexar importacao");
  syn("excluir", "apagar apaga remover remove deletar eliminar tirar lixeira exclusao exclui");
  syn("editar", "alterar altera corrigir corrige modificar atualizar edicao edita");
  syn("trocar", "mudar mudo muda mudou mudanca trocar troco troca trocou transferir transfere transferencia mover move remanejar remaneja");
  syn("sumir", "sumiu sumiram sumido sumida desapareceu desapareceram desaparecer sumindo");
  syn("criar", "cadastrar cadastra adicionar adiciona incluir inclui inserir novo nova criacao");
  syn("registrar", "lancar lanca registro registra");
  syn("vencimento", "vence vencer vencido vencida vencidos vencidas venceu vencendo validade expirar expirado expira expirou prazo vencem");
  syn("afastamento", "afastado afastada afastados afastar ferias licenca atestado inss");
  syn("aptidao", "apto apta aptos aptas");
  syn("bolinha", "bola bolinhas bolas circulo");
  syn("imprimir", "impressao imprime impresso pdf");
  syn("erro", "falha falhou problema problemas bug travou quebrou travado");
  syn("tema", "escuro claro dark colorido cor cores aparencia");
  syn("buscar", "pesquisar pesquisa procurar procura achar encontrar localizar busca");
  syn("demonstracao", "demo ficticio ficticios simulacao");
  syn("backup", "copia");
  syn("polivalencia", "versatilidade");
  syn("estrategica", "estrategico estrategia");
  syn("pre", "pre-");

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9%\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function stem(w) {
    if (w.length <= 3 || /^\d/.test(w)) return w;
    w = w.replace(/(coes|goes|moes|noes|poes|toes|oes)$/, "ao").replace(/aes$/, "ao")
      .replace(/eis$/, "el").replace(/ais$/, "al");
    if (w.length > 4 && /[rzs]es$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && /[^s]s$/.test(w)) w = w.slice(0, -1);
    w = w.replace(/mente$/, "");
    const v = w.match(/(ando|endo|indo|ados|adas|idos|idas|ado|ada|ido|ida|ar|er|ir)$/);
    if (v && w.length - v[1].length >= 3) w = w.slice(0, -v[1].length);
    if (w.length > 4 && /[aeo]$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  function tokens(s, keepStop) {
    const out = [];
    norm(s).split(" ").forEach(raw => {
      if (!raw) return;
      if (!keepStop && STOP.has(raw)) return;
      const c = SYN[raw] || raw;
      const st = stem(c);
      if (st.length >= 2 || /^\d/.test(st)) out.push(st);
    });
    return Array.from(new Set(out));
  }

  /* ---------- índice ---------- */
  const VOCAB = new Set();
  const ALLV = new Set();
  const DF = new Map();
  KB.forEach(t => {
    t.kw = new Map(); t.tx = new Map(); t.pn = [];
    const put = (list, weight) => list.forEach(w => { VOCAB.add(w); if (!t.kw.has(w) || t.kw.get(w) < weight) t.kw.set(w, weight); });
    (t.k || []).forEach(k => {
      const tk = tokens(k, true).filter(w => !STOP.has(w)); put(tk, 2.0);
      const n = norm(k); if (n.split(" ").length >= 2) t.pn.push({ n, toks: tk, len: n.length, weak: true });
    });
    put(tokens(t.title), 1.4);
    (t.p || []).forEach(p => {
      const tk = tokens(p); put(tk, 1.3);
      t.pn.push({ n: norm(p), toks: tk, len: norm(p).length, weak: false });
    });
    tokens(t.a).forEach(w => { ALLV.add(w); if (!t.kw.has(w)) t.tx.set(w, 0.18); });
    new Set([...t.kw.keys(), ...t.tx.keys()]).forEach(w => DF.set(w, (DF.get(w) || 0) + 1));
  });
  const N = KB.length;
  const IDF = new Map();
  DF.forEach((df, w) => IDF.set(w, Math.log(1 + N / df)));
  const IDFMAX = Math.log(1 + N);

  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const m = a.length, n = b.length; let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i; let rowMin = cur[0];
      for (let j = 1; j <= n; j++) {
        const c = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      const t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }
  function correct(w) {
    if (VOCAB.has(w) || ALLV.has(w) || /^\d/.test(w) || w.length < 7) return { w, fuzzy: false };
    const max = w.length <= 8 ? 1 : 2; let best = null, bd = max + 1;
    VOCAB.forEach(v => { if (v[0] === w[0] && Math.abs(v.length - w.length) <= max) { const d = dist(w, v, max); if (d < bd) { bd = d; best = v; } } });
    return best && bd <= max ? { w: best, fuzzy: true } : { w, fuzzy: false };
  }

  function score(t, qt, qn, qset, fz) {
    let s = 0, matched = 0;
    qt.forEach(w => {
      const idf = IDF.get(w) || IDFMAX;
      const g = (t.kw.get(w) || t.tx.get(w) || 0) * (fz && fz.has(w) ? 0.75 : 1);
      if (g) { s += g * idf; matched++; }
    });
    if (!matched && !t.pn.length) return 0;
    const cov = qt.length ? matched / qt.length : 0;
    s *= 0.5 + 0.5 * cov;
    t.pn.forEach(ph => {
      if (ph.n && qn.indexOf(ph.n) >= 0) s += (ph.weak ? 2.0 : 5.0) + Math.min(ph.len, 40) * 0.08;
      else if (ph.toks.length >= 2 && ph.toks.every(x => qset.has(x))) s += ph.weak ? 1.2 : 2.6;
    });
    const tt = tokens(t.title);
    if (tt.length) { const inter = tt.filter(x => qset.has(x)).length; s += (inter / tt.length) * 1.5; }
    return s;
  }

  /* ---------- conversa ---------- */
  const SMALL = [
    { re: /^(oi+|ola+|opa|e ai|eai|bom dia|boa tarde|boa noite|hey|hello|salve)\b/, t: "hello" },
    { re: /\b(obrigad[oa]|brigad[oa]|valeu|vlw|muito bom|ajudou|perfeito|show|top|legal)\b/, t: "thanks" },
    { re: /^(tchau|ate mais|ate logo|flw|falou|encerrar|fui)\b/, t: "bye" },
    { re: /\b(tudo bem|como vai|como voce esta|td bem)\b/, t: "how" },
    { re: /^(ajuda|help|socorro|me ajuda|preciso de ajuda|\?)$/, t: "help" },
    { re: /\b(nao entendi|nao compreendi|explica melhor|explique melhor|de outro jeito|mais detalhes|detalha|detalhar|mais simples|exemplo|nao ficou claro)\b/, t: "more" }
  ];
  const CAT_ORDER = ["Primeiros passos", "Colaboradores", "Setores e atividades", "Treinamentos", "Vencimentos", "Matrizes e aptidão", "Afastamentos", "Excel", "Dados e sincronização", "Problemas comuns", "Glossário", "Sobre a Dona Brainda"];
  const THRESH = { min: 3.2, close: 0.78 };
  const SUBJECTS = ["colaborador", "setor", "atividade", "treinamento", "excel", "afastamento", "matriz", "aptidao", "vencimento", "bolinha", "catalogo"].map(w => stem(SYN[w] || w));

  function related(t, n) {
    return (t.rel || []).map(id => byId[id]).filter(Boolean).slice(0, n || 3);
  }
  function rank(qt, qn, boost, fz) {
    const qset = new Set(qt);
    return KB.map(t => {
      let s = score(t, qt, qn, qset, fz);
      if (boost) s *= boost(t);
      return { t, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  }

  function ask(text, ctx) {
    ctx = ctx || {};
    const raw = String(text || "").trim();
    const qn = norm(raw);
    if (!qn) return { kind: "empty" };

    for (const sm of SMALL) {
      if (sm.re.test(qn)) {
        if (sm.t === "more") {
          const last = ctx.lastId && byId[ctx.lastId];
          if (last) return { kind: "more", topic: last, alts: related(last, 3) };
          return { kind: "fallback", alts: [] };
        }
        if (qn.split(" ").length <= 6) return { kind: "small", type: sm.t };
      }
    }

    const fz = new Set();
    let qt = tokens(raw).map(w => { const c = correct(w); if (c.fuzzy) fz.add(c.w); return c.w; });
    qt = Array.from(new Set(qt));
    const unknown = qt.filter(w => !ALLV.has(w) && !VOCAB.has(w) && !/^\d/.test(w));
    const why = /\b(por que|porque|pq|por qual motivo|como que)\b/.test(qn) || /\b(nao (aparece|consigo|funciona|aparecem|carrega|salva|abre|deixa|bate|vejo|encontro)|sumiu|sumiram|desapareceu|desapareceram|erro|travou|bloqueado|errado|errada|estranho)\b/.test(qn);
    const def = /\b(o que (e|significa|quer dizer)|qual (e )?a diferenca|diferenca entre|significado)\b/.test(qn);
    const boost = t => {
      let b = 1;
      if (why && (t.cat === "Problemas comuns")) b *= 1.35;
      if (def && t.id === "diferenca-matrizes") b *= 1.15;
      return b;
    };
    let ranked = rank(qt, qn, boost, fz);

    /* acompanhamento: pergunta curta que depende do assunto anterior */
    let usedCtx = false;
    const last = ctx.lastId && byId[ctx.lastId];
    if (last && qt.length <= 3 && (!ranked.length || ranked[0].s < THRESH.min * 1.5)) {
      const extra = SUBJECTS.filter(w => last.kw.has(w)).slice(0, 2);
      if (extra.length) {
        const mixed = Array.from(new Set(qt.concat(extra)));
        const r2 = rank(mixed, qn, boost, fz);
        if (r2.length && r2[0].s >= THRESH.min && r2[0].t.id !== last.id) { ranked = r2; usedCtx = true; }
      }
    }
    const known = qt.length - unknown.length;
    if (unknown.length && (known === 0 || (unknown.length / qt.length >= 0.75 && known <= 1 && (!ranked.length || ranked[0].s < 8)))) ranked = [];

    if (!ranked.length || ranked[0].s < THRESH.min) {
      const alts = ranked.filter(x => x.s >= 1.2).slice(0, 4).map(x => x.t);
      return { kind: "fallback", alts, q: raw };
    }
    const top = ranked[0];
    const near = ranked.slice(1, 4).filter(x => x.s >= top.s * THRESH.close && x.s >= THRESH.min).map(x => x.t);
    return { kind: "answer", topic: top.t, score: top.s, near, rel: related(top.t, 3), usedCtx };
  }

  return {
    KB, byId, CAT_ORDER, ask, norm, tokens,
    categories() {
      const m = {};
      KB.forEach(t => { (m[t.cat] = m[t.cat] || []).push(t); });
      return CAT_ORDER.filter(c => m[c]).map(c => ({ name: c, topics: m[c] }));
    },
    pageSuggestions(page) {
      const P = {
        "Visão geral": ["visao-geral", "vencimento-cores", "niveis-avaliacao"],
        "Gestão Estratégica": ["estrategica", "matriz-operacional", "relacao-treinamentos"],
        "Colaboradores": ["colab-criar", "colab-editar", "afastamento"],
        "Setores": ["setor-criar", "setor-prereq", "matriz-operacional"],
        "Cadastro de treinamentos": ["catalogo-criar", "catalogo-global", "catalogo-lote"],
        "Treinamentos realizados": ["treino-registrar", "treino-filtros", "treino-renovar"],
        "matriz": ["matriz-operacional", "matriz-nivel-auto", "matriz-escolher-cursos"]
      };
      return (P[page] || ["primeiros-passos", "diferenca-matrizes", "excel-importar"]).map(id => byId[id]).filter(Boolean);
    }
  };
})();
if (typeof module !== "undefined") module.exports = BraindaEngine;

/* Dona Brainda — interface (Shadow DOM, isolada dos estilos do app) */
(function () {
  if (window.DonaBrainda) return;
  const E = BraindaEngine;
  const SS_KEY = "dbr.chat.v1", LS_UNANS = "dbr.unanswered.v1", LS_SEEN = "dbr.seen.v1", SS_OLA = "dbr.ola.v1";
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- saudação pelo horário (fuso de Brasília, como o resto da ferramenta) ---------- */
  function horaBR() {
    try {
      const n = parseInt(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false }).format(new Date()), 10);
      if (isNaN(n)) return new Date().getHours();
      return n === 24 ? 0 : n;
    } catch (e) { return new Date().getHours(); }
  }
  function saudacao() {
    const h = horaBR();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }
  const CORTEX = "Vamos usar o meu córtex central para suas dúvidas? 🧠";

  /* ---------- utilitários ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const inline = s => esc(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
  function md(src) {
    const lines = String(src).replace(/\r/g, "").split("\n");
    let out = "", i = 0;
    while (i < lines.length) {
      const ln = lines[i];
      if (!ln.trim()) { i++; continue; }
      if (/^\|/.test(ln)) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        const cells = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
        const head = cells(rows[0]); const body = rows.slice(2).map(cells);
        out += "<table><thead><tr>" + head.map(c => "<th>" + inline(c) + "</th>").join("") + "</tr></thead><tbody>" +
          body.map(r => "<tr>" + r.map(c => "<td>" + inline(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
        continue;
      }
      if (/^- /.test(ln)) {
        let li = ""; while (i < lines.length && /^- /.test(lines[i])) { li += "<li>" + inline(lines[i].slice(2)) + "</li>"; i++; }
        out += "<ul>" + li + "</ul>"; continue;
      }
      if (/^\d+\. /.test(ln)) {
        let li = ""; while (i < lines.length && /^\d+\. /.test(lines[i])) { li += "<li>" + inline(lines[i].replace(/^\d+\. /, "")) + "</li>"; i++; }
        out += "<ol>" + li + "</ol>"; continue;
      }
      if (/^> /.test(ln)) {
        let q = []; while (i < lines.length && /^> /.test(lines[i])) { q.push(inline(lines[i].slice(2))); i++; }
        out += "<blockquote>" + q.join("<br>") + "</blockquote>"; continue;
      }
      let p = []; while (i < lines.length && lines[i].trim() && !/^(\||- |\d+\. |> )/.test(lines[i])) { p.push(inline(lines[i])); i++; }
      out += "<p>" + p.join("<br>") + "</p>";
    }
    return out;
  }
  const store = {
    get(k, area) { try { return JSON.parse((area || sessionStorage).getItem(k)); } catch (e) { return null; } },
    set(k, v, area) { try { (area || sessionStorage).setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } }
  };
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

  /* sulcos/sinapses do cérebro — desenhados duas vezes: camada fixa + camada de pulso animado */
  const SULCOS = '<path d="M20 22c3.500 0 5.500 2.200 5.500 5.500"/><path d="M17 36c3.500 0 6.500-2.200 6.500-5.500"/>' +
    '<path d="M44 22c-3.500 0-5.500 2.200-5.500 5.500"/><path d="M47 36c-3.500 0-6.500-2.200-6.500-5.500"/>' +
    '<path d="M27 43c1.500 1.500 3 2 4.500 2"/><path d="M37 43c-1.500 1.500-3 2-4.500 2"/><path d="M32 14v34"/>';
  const TRACO = ' fill="none" stroke="#0755bd" stroke-width="2.200" stroke-linecap="round"';
  const BRAIN = '<svg class="brain" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
    '<g class="hemi hemi-l"><path d="M31 11c-3-4-10-4-13 1-5 0-9 4-9 9 0 2 .6 3.6 1.6 5C8 28.500 7 31 7 33.500c0 5 4 8.500 8.500 8.500.5 4 4 7.500 8.500 7.500 3 0 5.500-1.500 7-4V11z" fill="#ffffff"/></g>' +
    '<g class="hemi hemi-r"><path d="M33 11c3-4 10-4 13 1 5 0 9 4 9 9 0 2-.6 3.600-1.600 5C56 28.500 57 31 57 33.500c0 5-4 8.500-8.500 8.500-.5 4-4 7.500-8.500 7.500-3 0-5.500-1.500-7-4V11z" fill="#ffffff"/></g>' +
    '<g class="sulcos"' + TRACO + '>' + SULCOS + '</g>' +
    '<g class="pulso"' + TRACO + '>' + SULCOS + '</g>' +
    '<g class="faisca"><circle cx="20" cy="22" r="2.4"/><circle cx="44" cy="22" r="2.4"/>' +
    '<circle cx="23.500" cy="30.500" r="2.4"/><circle cx="40.500" cy="30.500" r="2.4"/></g>' +
    '<g class="cortex"><path d="M31 11c-3-4-10-4-13 1-5 0-9 4-9 9 0 2 .6 3.6 1.6 5" fill="none" stroke="#ffd166" stroke-width="2.600" stroke-linecap="round" stroke-dasharray="46" stroke-dashoffset="46"/>' +
    '<path d="M33 11c3-4 10-4 13 1 5 0 9 4 9 9 0 2-.6 3.600-1.600 5" fill="none" stroke="#ffd166" stroke-width="2.600" stroke-linecap="round" stroke-dasharray="46" stroke-dashoffset="46"/></g>' +
    '</svg>';

  /* ---------- CSS ---------- */
  const CSS = `
:host{all:initial;font-family:inherit}
*{box-sizing:border-box}
.wrap{--bg:#fff;--fg:#1e2d43;--muted:#566780;--line:#d6e0ee;--pri:#0755bd;--pri2:#6a3df0;--g1:#0755bd;--g2:#6a3df0;--prifg:#fff;--bot:#eef3fb;--user:#0755bd;--userfg:#fff;--chip:#fff;--chipline:#a9c2e6;--chipfg:#0b4aa1;--shadow:0 18px 50px rgba(15,35,70,.28);--focus:#ff9f1a;
  font-family:inherit;color:var(--fg);font-size:15px;line-height:1.5}
:host([data-theme="dark"]) .wrap{--bg:#18253a;--fg:#e7f0ff;--muted:#a3b4cf;--line:#2c3e5c;--pri:#5aa0ff;--pri2:#9b7bff;--g1:#1f5fd1;--g2:#6c43e8;--prifg:#06142b;--bot:#223149;--user:#2f6fe0;--userfg:#fff;--chip:#1d2c44;--chipline:#3b5584;--chipfg:#a9ccff;--shadow:0 18px 50px rgba(0,0,0,.55)}
button,textarea{font:inherit;color:inherit}
button{cursor:pointer}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
textarea:focus-visible{outline:2px solid var(--pri);outline-offset:0}
.fab{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;border:0;padding:11px;background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 8px 24px rgba(7,85,189,.45);display:grid;place-items:center;transition:transform .15s ease}
:host([data-theme="dark"]) .fab{box-shadow:0 8px 24px rgba(0,0,0,.6)}
.fab:hover{transform:scale(1.07)}
.fab svg{width:100%;height:100%}
.fab::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--pri);opacity:0;animation:ring 2.4s ease-out 1.2s 3}
@keyframes ring{0%{transform:scale(.9);opacity:.7}100%{transform:scale(1.35);opacity:0}}

/* ---------- o cérebro vivo da Dona Brainda ---------- */
.brain{overflow:visible}
.brain .hemi{transform-box:fill-box;transform-origin:center;animation:respira 3.6s ease-in-out infinite}
.brain .hemi-r{animation-delay:-1.8s}
.brain .sulcos{opacity:.45}
.brain .pulso{stroke-dasharray:6 14;animation:sinapse 2.6s linear infinite}
.brain .faisca circle{fill:#ffd166;opacity:0;transform-box:fill-box;transform-origin:center;animation:faisca 4.4s ease-in-out infinite}
.brain .faisca circle:nth-child(2){animation-delay:1.1s}
.brain .faisca circle:nth-child(3){animation-delay:2.2s}
.brain .faisca circle:nth-child(4){animation-delay:3.3s}
.brain .cortex{opacity:0}
@keyframes respira{0%,100%{transform:scale(1)}50%{transform:scale(1.065)}}
@keyframes sinapse{to{stroke-dashoffset:-40}}
@keyframes faisca{0%,72%,100%{opacity:0;transform:scale(.3)}80%{opacity:.95;transform:scale(1)}92%{opacity:0;transform:scale(1.7)}}
@keyframes flutua{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-3px) rotate(2deg)}}
@keyframes aura{0%,100%{box-shadow:0 8px 24px rgba(7,85,189,.45),0 0 0 0 rgba(106,61,240,.5)}60%,100%{box-shadow:0 8px 24px rgba(7,85,189,.45),0 0 0 12px rgba(106,61,240,0)}}
@keyframes acende{0%{stroke-dashoffset:46;opacity:0}25%{opacity:1}100%{stroke-dashoffset:0;opacity:0}}
.fab{animation:aura 3.6s ease-in-out infinite}
.fab .brain,.av .brain{animation:flutua 4.4s ease-in-out infinite}
/* o córtex central se acende quando a Brainda cumprimenta ou pensa */
.av.fala .brain .cortex,.mini.pensa .brain .cortex{opacity:1}
.av.fala .brain .cortex path,.mini.pensa .brain .cortex path{animation:acende 1.6s ease-in-out infinite}
.av.fala .brain .cortex path:last-child,.mini.pensa .brain .cortex path:last-child{animation-delay:.25s}
.av.fala .brain .hemi{animation-duration:1.4s}
/* nas mensagens o cérebro é mais discreto — e acelera quando está pensando */
.msg .mini .brain .hemi{animation-duration:5.4s}
.msg .mini .brain .faisca{display:none}
.mini.pensa .brain .hemi{animation-duration:1.1s}
.mini.pensa .brain .pulso{animation-duration:.9s}
.mini.pensa .brain .faisca{display:block}
.mini.pensa .brain .faisca circle{animation-duration:1.5s}
.hint{position:fixed;right:90px;bottom:30px;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:14px 14px 4px 14px;padding:9px 13px;box-shadow:var(--shadow);font-size:14px;max-width:230px}
.hint[hidden],.panel[hidden],.menu[hidden]{display:none}
.panel{position:fixed;right:20px;bottom:92px;width:min(410px,calc(100vw - 24px));height:min(660px,calc(100dvh - 116px));background:var(--bg);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);display:flex;flex-direction:column;overflow:hidden;animation:pop .16s ease-out}
@keyframes pop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
header{position:relative;display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}
:host([data-theme="dark"]) header{color:#fff}
.av{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;padding:6px;flex:none}
.av svg{width:100%;height:100%}
.ttl{flex:1;min-width:0;display:flex;flex-direction:column}
.ttl strong{font-size:16px;line-height:1.2}
.ttl small{font-size:12px;opacity:.9}
.ib{width:34px;height:34px;border-radius:9px;border:0;background:rgba(255,255,255,.16);color:#fff;font-size:18px;line-height:1;display:grid;place-items:center}
.ib:hover{background:rgba(255,255,255,.28)}
.menu{position:absolute;right:10px;top:54px;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);padding:6px;z-index:3;min-width:220px}
.menu button{display:block;width:100%;text-align:left;border:0;background:transparent;padding:9px 11px;border-radius:8px;font-size:14px}
.menu button:hover{background:var(--bot)}
.log{position:relative;flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;overscroll-behavior:contain}
@media (prefers-reduced-motion:reduce){.log{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
.msg{display:flex;gap:8px;max-width:100%}
.msg.user{justify-content:flex-end}
.msg .mini{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--g1),var(--g2));padding:4px;flex:none;margin-top:2px}
.msg .mini svg{width:100%;height:100%}
.col{display:flex;flex-direction:column;gap:6px;min-width:0;max-width:calc(100% - 38px)}
.bub{background:var(--bot);border-radius:4px 16px 16px 16px;padding:10px 13px;overflow-wrap:anywhere}
.msg.user .bub{background:var(--user);color:var(--userfg);border-radius:16px 4px 16px 16px;max-width:88%;white-space:pre-wrap}
.bub p{margin:0 0 8px}.bub p:last-child{margin:0}
.bub ul,.bub ol{margin:4px 0 8px;padding-left:20px}.bub li{margin:2px 0}
.bub blockquote{margin:6px 0;padding:6px 10px;border-left:3px solid var(--pri);background:rgba(7,85,189,.07);border-radius:0 8px 8px 0}
:host([data-theme="dark"]) .bub blockquote{background:rgba(90,160,255,.1)}
.bub table{border-collapse:collapse;width:100%;margin:6px 0;font-size:14px}
.bub th,.bub td{border:1px solid var(--line);padding:5px 8px;text-align:left}
.bub th{background:rgba(7,85,189,.08)}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--chipline);background:var(--chip);color:var(--chipfg);border-radius:999px;padding:6px 12px;font-size:13.5px;text-align:left;line-height:1.3}
.chip:hover{background:var(--bot)}
.chip.cat{border-style:dashed}
.lbl{font-size:12.5px;color:var(--muted);margin-top:2px}
.fb{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:12.5px}
.fb button{border:1px solid var(--line);background:transparent;border-radius:8px;padding:2px 9px;font-size:14px;line-height:1.5}
.fb button:hover{background:var(--bot)}
.typing{display:flex;gap:4px;padding:12px 14px}
.typing i{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:blink 1s infinite ease-in-out}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes blink{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
form{display:flex;gap:8px;padding:10px 12px 6px;border-top:1px solid var(--line);background:var(--bg)}
textarea{flex:1;resize:none;border:1px solid var(--line);background:var(--bg);border-radius:12px;padding:9px 12px;max-height:104px;min-height:42px;line-height:1.4}
textarea::placeholder{color:var(--muted)}
.send{width:44px;border:0;border-radius:12px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;font-size:18px;flex:none}
.send:disabled{opacity:.5;cursor:not-allowed}
.foot{padding:0 14px 10px;font-size:11.5px;color:var(--muted);background:var(--bg)}
.copy{align-self:flex-start;border:1px solid var(--line);background:transparent;border-radius:8px;padding:3px 10px;font-size:13px}
/* ---------- pop-up de boas-vindas ---------- */
.ovl{position:fixed;inset:0;background:rgba(9,22,45,.58);display:grid;place-items:center;padding:18px;animation:fade .2s ease-out}
:host([data-theme="dark"]) .ovl{background:rgba(0,0,0,.66)}
.ovl[hidden]{display:none}
@keyframes fade{from{opacity:0}to{opacity:1}}
.card{width:min(390px,100%);background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow);padding:24px 22px 20px;text-align:center;animation:pop .22s ease-out}
.avbig{width:84px;height:84px;margin:0 auto 14px;padding:13px;background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 10px 26px rgba(7,85,189,.34)}
:host([data-theme="dark"]) .avbig{box-shadow:0 10px 26px rgba(0,0,0,.5)}
.card h2{margin:0 0 8px;font-size:19px;line-height:1.3;font-weight:650}
.card h2 strong{background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent}
:host([data-theme="dark"]) .card h2 strong{color:var(--pri);background:none}
.card p{margin:0 0 18px;font-size:15px;color:var(--muted)}
.acts{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.btn{border:0;border-radius:12px;padding:11px 18px;font-size:14.5px;font-weight:600;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}
.btn:hover{filter:brightness(1.08)}
.btn.sec{background:none;color:var(--muted);border:1px solid var(--line);font-weight:500}
.btn.sec:hover{background:var(--bot);filter:none}
@media (max-width:560px){
  .panel{inset:0;right:0;bottom:0;width:auto;height:100dvh;border-radius:0;border:0}
  .fab{right:14px;bottom:14px}.hint{right:82px;bottom:22px}
  form{padding-bottom:calc(6px + env(safe-area-inset-bottom))}
}`;

  /* ---------- montagem ---------- */
  const host = document.createElement("div");
  host.id = "dona-brainda-host";
  host.setAttribute("data-dona-brainda", "");
  host.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;z-index:2147483000;pointer-events:auto;";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = '<style>' + CSS + '</style>' +
    '<div class="wrap">' +
    '<button class="fab" type="button" aria-label="Abrir a Dona Brainda, assistente de dúvidas da ferramenta" aria-expanded="false" aria-controls="dbr-panel">' + BRAIN + '</button>' +
    '<div class="hint" role="status" hidden>Dúvidas? Pergunte à <strong>Dona Brainda</strong> 🧠</div>' +
    '<div class="ovl" role="dialog" aria-modal="true" aria-labelledby="dbr-ola" hidden>' +
    '<div class="card">' +
    '<div class="av avbig fala">' + BRAIN + '</div>' +
    '<h2 id="dbr-ola">Olá, sou a <strong>Dona Brainda</strong></h2>' +
    '<p>Vamos usar o meu córtex central para suas dúvidas?</p>' +
    '<div class="acts">' +
    '<button class="btn" type="button" data-act="ovl-sim">Sim, vamos! 🧠</button>' +
    '<button class="btn sec" type="button" data-act="ovl-depois">Agora não</button>' +
    '</div></div></div>' +
    '<section class="panel" id="dbr-panel" role="dialog" aria-label="Dona Brainda, assistente de dúvidas da ferramenta" hidden>' +
    '<header><div class="av">' + BRAIN + '</div><div class="ttl"><strong>Dona Brainda</strong><small>Cérebro da ferramenta · offline</small></div>' +
    '<button class="ib" type="button" data-act="menu" aria-label="Menu da Dona Brainda" aria-haspopup="true" aria-expanded="false">⋯</button>' +
    '<button class="ib" type="button" data-act="close" aria-label="Fechar a Dona Brainda">✕</button>' +
    '<div class="menu" role="menu" hidden>' +
    '<button type="button" role="menuitem" data-m="topics">📚 Todos os assuntos</button>' +
    '<button type="button" role="menuitem" data-m="page">📍 Ajuda para esta tela</button>' +
    '<button type="button" role="menuitem" data-m="unans">📝 Perguntas sem resposta</button>' +
    '<button type="button" role="menuitem" data-m="clear">🧹 Limpar conversa</button></div></header>' +
    '<div class="log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>' +
    '<form autocomplete="off"><textarea rows="1" maxlength="400" placeholder="Pergunte sobre qualquer função…" aria-label="Escreva sua pergunta para a Dona Brainda"></textarea>' +
    '<button class="send" type="submit" aria-label="Enviar pergunta">➤</button></form>' +
    '<div class="foot">Só explico a ferramenta — não vejo os dados das pessoas. Dica: aperte <strong>?</strong> para me chamar.</div>' +
    '</section></div>';
  const $ = s => root.querySelector(s);
  const fab = $(".fab"), hint = $(".hint"), panel = $(".panel"), log = $(".log"), form = $("form"), ta = $("textarea"), menu = $(".menu"), send = $(".send");
  const menuBtn = $('[data-act="menu"]');
  const ovl = $(".ovl"), ovlSim = $('[data-act="ovl-sim"]'), ovlDepois = $('[data-act="ovl-depois"]');
  hint.innerHTML = esc(saudacao()) + '! Dúvidas? Fale com a <strong>Dona Brainda</strong> 🧠';

  /* o app usa diálogos (Radix) que fecham ao clicar/focar fora: isolamos os eventos da Brainda */
  ["pointerdown", "mousedown", "touchstart", "focusin", "focusout"].forEach(t => host.addEventListener(t, e => e.stopPropagation()));

  /* tema acompanha o app */
  const syncTheme = () => host.setAttribute("data-theme", document.documentElement.dataset.theme || "light");
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* não imprimir */
  const pst = document.createElement("style");
  pst.textContent = "@media print{#dona-brainda-host{display:none!important}}";
  document.head.appendChild(pst);

  /* ---------- estado ---------- */
  let history = store.get(SS_KEY) || [];
  let lastId = null;
  let busy = false;

  const save = () => store.set(SS_KEY, history.slice(-40));
  function currentPage() {
    try {
      if (document.querySelector(".sese-poly-table")) return "matriz";
      const h = document.querySelector(".page-heading h1");
      return h ? h.textContent.trim() : "";
    } catch (e) { return ""; }
  }

  /* ---------- renderização ---------- */
  function chipEl(c) {
    const b = el("button", "chip" + (c.cat ? " cat" : ""), c.l);
    b.type = "button";
    b.addEventListener("click", () => onChip(c));
    return b;
  }
  function scrollToNew(node) {
    const top = Math.max(0, node.offsetTop - 14);
    if (reduced) log.scrollTop = top; else log.scrollTo({ top, behavior: "smooth" });
  }
  function renderMsg(m, animate) {
    const row = el("div", "msg " + (m.r === "u" ? "user" : "bot"));
    if (m.r === "u") {
      row.appendChild(el("div", "bub", m.t));
    } else {
      const mini = el("div", "mini"); mini.innerHTML = BRAIN; row.appendChild(mini);
      const col = el("div", "col");
      const bub = el("div", "bub"); bub.innerHTML = md(m.t); col.appendChild(bub);
      if (m.copy) {
        const cb = el("button", "copy", "Copiar lista"); cb.type = "button";
        cb.addEventListener("click", () => copyText(m.copy, cb)); col.appendChild(cb);
      }
      if (m.lbl) col.appendChild(el("div", "lbl", m.lbl));
      if (m.chips && m.chips.length) { const w = el("div", "chips"); m.chips.forEach(c => w.appendChild(chipEl(c))); col.appendChild(w); }
      if (m.fb) {
        const f = el("div", "fb"); f.appendChild(el("span", null, "Ajudou?"));
        const up = el("button", null, "👍"), dn = el("button", null, "👎");
        up.type = dn.type = "button"; up.setAttribute("aria-label", "Resposta útil"); dn.setAttribute("aria-label", "Resposta não ajudou");
        up.addEventListener("click", () => { f.textContent = "Que bom! 💙"; });
        dn.addEventListener("click", () => { f.textContent = "Anotei, obrigada."; logUnanswered(m.q || "", m.id, "avaliada como não útil"); post({ t: "Poxa, desculpe! Tente **reformular com outras palavras** ou escolha um assunto abaixo.", chips: home().chips }); });
        f.appendChild(up); f.appendChild(dn); col.appendChild(f);
      }
      row.appendChild(col);
    }
    log.appendChild(row);
    if (animate) scrollToNew(row); else log.scrollTop = log.scrollHeight;
    return row;
  }
  function push(m) { history.push(m); save(); return m; }
  function post(m) { m.r = "b"; push(m); return renderMsg(m, true); }
  function user(text) { const m = { r: "u", t: text }; push(m); renderMsg(m, true); }
  function typing() {
    const row = el("div", "msg bot"); const mini = el("div", "mini pensa"); mini.innerHTML = BRAIN; row.appendChild(mini);
    const b = el("div", "bub typing"); b.innerHTML = "<i></i><i></i><i></i>"; b.setAttribute("aria-label", "A Dona Brainda está pensando"); row.appendChild(b);
    log.appendChild(row); log.scrollTop = log.scrollHeight; return row;
  }
  function reply(m, textLen) {
    busy = true; send.disabled = true;
    const t = typing();
    const d = reduced ? 0 : Math.min(800, 220 + (textLen || 100) * 0.3);
    setTimeout(() => { t.remove(); post(m); busy = false; send.disabled = false; ta.focus({ preventScroll: true }); }, d);
  }

  /* ---------- conteúdo ---------- */
  const tchip = t => ({ l: t.title, topic: t.id });
  function home(prefix) {
    const pageTopics = E.pageSuggestions(currentPage());
    const page = currentPage();
    const chips = pageTopics.map(tchip).concat(E.categories().filter(c => c.name !== "Sobre a Dona Brainda").map(c => ({ l: c.name, cat: c.name })));
    const intro = (prefix ? prefix + "\n\n" : "") + "Pergunte do seu jeito — **como fazer** algo, **o que significa** um termo ou **por que** algo aparece de determinada forma." +
      (page ? "\n\nVocê está em **" + (page === "matriz" ? "Matriz de Competência" : page) + "**; os primeiros botões são sugestões para esta tela. Os de contorno tracejado abrem um assunto." : "");
    return { t: intro, chips };
  }
  function showCategory(name) {
    const c = E.categories().find(x => x.name === name); if (!c) return;
    post({ t: "**" + name + "** — escolha o que quer saber:", chips: c.topics.map(tchip) });
  }
  function answerTopic(t, extraChips, q) {
    const chips = []; const seen = new Set([t.id]);
    (extraChips || []).concat((t.rel || []).map(id => E.byId[id]).filter(Boolean)).forEach(x => { if (!seen.has(x.id)) { seen.add(x.id); chips.push(tchip(x)); } });
    lastId = t.id;
    return { t: t.a, chips: chips.slice(0, 5), lbl: chips.length ? "Veja também:" : "", fb: true, q: q || "", id: t.id };
  }
  function showTopic(id, label) {
    const t = E.byId[id]; if (!t) return;
    if (label) user(label);
    reply(answerTopic(t, [], label), t.a.length);
  }
  function logUnanswered(q, id, why) {
    if (!q) return;
    const list = store.get(LS_UNANS, localStorage) || [];
    list.unshift({ q: q.slice(0, 300), id: id || "", why: why || "sem resposta", ts: new Date().toISOString().slice(0, 16).replace("T", " ") });
    store.set(LS_UNANS, list.slice(0, 50), localStorage);
  }
  function handle(text) {
    const res = E.ask(text, { lastId });
    if (res.kind === "empty") return;
    if (res.kind === "small") {
      if (res.type === "hello" || res.type === "how" || res.type === "help") falar();
      const msgs = {
        hello: saudacao() + "! 😊 " + CORTEX,
        thanks: "De nada! Se surgir outra dúvida, é só chamar. 💙",
        bye: "Até mais! Estarei por aqui (aperte **?** para me chamar).",
        how: "Tudo certo por aqui, com os neurônios em dia 🧠. E com você? Me diga a sua dúvida sobre a ferramenta.",
        help: "Claro! " + CORTEX + "\n\nEscolha um assunto ou escreva sua dúvida do seu jeito."
      };
      const base = home().chips;
      return reply({ t: msgs[res.type] || msgs.hello, chips: (res.type === "hello" || res.type === "how" || res.type === "help") ? base : [] }, 60);
    }
    if (res.kind === "more") {
      const chips = res.alts.map(tchip);
      return reply({ t: "Sem problema! Vamos por outro ângulo sobre **" + res.topic.title + "**. Escolha o que quer aprofundar, ou reescreva a dúvida com suas palavras (quanto mais específico, melhor):", chips: chips.concat([{ l: "Ver todos os assuntos", cat: "__all" }]) }, 80);
    }
    if (res.kind === "fallback") {
      logUnanswered(text, "", "sem resposta");
      const alts = (res.alts || []).map(tchip);
      const chips = alts.length ? alts : home().chips.slice(0, 6);
      return reply({ t: "Hmm, não achei uma resposta **segura** para isso. 🤔 Eu só sei explicar a ferramenta (cadastros, matrizes, vencimentos, Excel, afastamentos…).\n\n" + (alts.length ? "Será que é um destes?" : "Tente reescrever com outras palavras ou escolha um assunto:"), chips }, 120);
    }
    const t = res.topic;
    const near = (res.near || []);
    const m = answerTopic(t, near, text);
    if (near.length) m.lbl = "Também pode ser:";
    reply(m, t.a.length);
  }
  function onChip(c) {
    if (busy) return;
    if (c.topic) return showTopic(c.topic, c.l);
    if (c.cat === "__all") return showAll();
    if (c.cat) { user(c.l); return showCategory(c.cat); }
    if (c.act === "clearunans") { store.set(LS_UNANS, [], localStorage); return post({ t: "Lista apagada. ✔️" }); }
    if (c.ask) { user(c.ask); return handle(c.ask); }
  }
  function showAll() {
    post({ t: "Estes são os **assuntos** que eu conheço. Escolha uma área:", chips: E.categories().map(c => ({ l: c.name, cat: c.name })) });
  }
  function copyText(text, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = "Copiado ✓"; setTimeout(() => { btn.textContent = o; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* sem permissão */ } t.remove();
  }
  function showUnanswered() {
    const list = store.get(LS_UNANS, localStorage) || [];
    if (!list.length) return post({ t: "Nenhuma pergunta sem resposta guardada neste navegador. 🎉" });
    const txt = list.map((x, i) => (i + 1) + ". " + x.q + "  [" + x.why + " · " + x.ts + "]").join("\n");
    const m = post({ t: "**Perguntas que não consegui responder** (guardadas só neste navegador). Copie e envie ao responsável pela ferramenta para eu aprender:\n\n" + list.slice(0, 12).map(x => "- " + x.q).join("\n") + (list.length > 12 ? "\n- … e mais " + (list.length - 12) : ""), copy: txt,
      chips: [{ l: "Apagar esta lista", act: "clearunans" }] });
  }
  function clearChat() {
    history = []; save(); log.textContent = ""; lastId = null; greet();
  }
  function greet() {
    const h = home("**" + saudacao() + "!** Eu sou a **Dona Brainda**, o cérebro desta ferramenta.\n\n" + CORTEX);
    post(h);
    falar();
  }
  /* acende o córtex central do cérebro do cabeçalho enquanto a Brainda cumprimenta */
  function falar() {
    const av = $(".av"); if (!av) return;
    av.classList.add("fala");
    clearTimeout(falar._t);
    falar._t = setTimeout(() => av.classList.remove("fala"), reduced ? 0 : 3600);
  }

  /* ---------- eventos ---------- */
  function setOpen(open) {
    panel.hidden = !open; fab.setAttribute("aria-expanded", String(open)); hint.hidden = true;
    if (open) {
      store.set(LS_SEEN, 1, localStorage);
      if (!log.children.length) { if (history.length) { history.forEach(m => renderMsg(m, false)); log.scrollTop = log.scrollHeight; } else greet(); }
      setTimeout(() => ta.focus({ preventScroll: true }), 30);
    } else { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); fab.focus({ preventScroll: true }); }
  }
  fab.addEventListener("click", () => setOpen(panel.hidden));
  $('[data-act="close"]').addEventListener("click", () => setOpen(false));
  menuBtn.addEventListener("click", () => { menu.hidden = !menu.hidden; menuBtn.setAttribute("aria-expanded", String(!menu.hidden)); });
  menu.addEventListener("click", e => {
    const b = e.target.closest("button[data-m]"); if (!b) return;
    menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false");
    const m = b.dataset.m;
    if (m === "topics") showAll();
    else if (m === "page") { const p = currentPage(); post({ t: "Dúvidas comuns **" + (p ? (p === "matriz" ? "na Matriz de Competência" : "em " + p) : "aqui") + "**:", chips: E.pageSuggestions(p).map(tchip) }); }
    else if (m === "unans") showUnanswered();
    else if (m === "clear") clearChat();
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = ta.value.trim(); if (!text || busy) return;
    ta.value = ""; autosize();
    user(text); handle(text);
  });
  ta.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
    if (e.key === "Escape") { e.stopPropagation(); if (!menu.hidden) { menu.hidden = true; } else setOpen(false); }
  });
  const autosize = () => { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 104) + "px"; };
  ta.addEventListener("input", autosize);
  panel.addEventListener("keydown", e => { if (e.key === "Escape") { if (!menu.hidden) { menu.hidden = true; menuBtn.focus(); } else setOpen(false); } });

  document.addEventListener("keydown", e => {
    if (e.key !== "?" || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.composedPath()[0];
    const tag = t && t.tagName ? t.tagName.toLowerCase() : "";
    if (/^(input|textarea|select)$/.test(tag) || (t && t.isContentEditable)) return;
    e.preventDefault(); setOpen(panel.hidden);
  });

  document.body.appendChild(host);

  /* ---------- pop-up de boas-vindas (uma vez por sessão do navegador) ---------- */
  function fecharOla(focarFab) {
    ovl.hidden = true;
    if (focarFab) fab.focus({ preventScroll: true });
  }
  function abrirOla() {
    if (!panel.hidden) return;
    ovl.hidden = false; hint.hidden = true;
    setTimeout(() => ovlSim.focus({ preventScroll: true }), 40);
  }
  ovlSim.addEventListener("click", () => { fecharOla(false); setOpen(true); });
  ovlDepois.addEventListener("click", () => fecharOla(true));
  ovl.addEventListener("click", e => { if (e.target === ovl) fecharOla(true); });
  ovl.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); fecharOla(true); } });

  if (!store.get(SS_OLA)) {
    setTimeout(() => { store.set(SS_OLA, 1); abrirOla(); }, 1200);
  }

  if (!store.get(LS_SEEN, localStorage)) {
    setTimeout(() => { if (panel.hidden && ovl.hidden) { hint.hidden = false; setTimeout(() => { hint.hidden = true; }, 9000); } }, 7000);
  }

  window.DonaBrainda = {
    open: () => setOpen(true), close: () => setOpen(false),
    ask: q => { setOpen(true); user(q); handle(q); },
    ola: () => abrirOla(),
    version: "1.1"
  };
  window.DonaBrendi = window.DonaBrainda; /* compatibilidade com o nome antigo */
})();

})();
