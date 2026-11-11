/* Consulta de gestão: usa os cadastros atuais, sem gravar ou duplicar dados. */
(function () {
  function buildModel(data, helpers) {
    const catalog = new Map(data.trainingCatalog.map(course => [course.id, course]));
    const departments = [...data.departments].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const employees = [...data.employees].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const possessed = new Map(employees.map(person => [person.id, helpers.courseIds(data, person.id)]));
    const absences = new Map(employees.map(person => [person.id, helpers.absence(data, person.id)]));
    const requirements = new Map(departments.map(department => [department.id,
      helpers.links(data, department.id).map(link => catalog.get(link.trainingId)).filter(Boolean)]));
    function assess(person, department) {
      const courses = requirements.get(department.id) || [];
      const held = possessed.get(person.id) || new Set();
      const missing = courses.filter(course => !held.has(course.id));
      const matched = courses.length - missing.length;
      const qualified = courses.length > 0 && missing.length === 0;
      const absence = absences.get(person.id) || {};
      return { person, department, courses, missing, matched, qualified,
        available: qualified && !absence.active, away: !!absence.active, refresh: !!absence.needsRefresh,
        percent: courses.length ? Math.round(matched / courses.length * 100) : null,
        status: !courses.length ? 'unconfigured' : qualified ? 'qualified' : 'pending' };
    }
    return { employees, departments, requirements, assess };
  }
  window.seseStrategyModel = buildModel;
  window.createSeseStrategy = function (React, helpers) {
    const h = React.createElement;
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const includes = (value, query) => normalize(query).trim().split(/\s+/).every(word => normalize(value).includes(word));
    return function SeseStrategy({ data, onDepartment, onPerson }) {
      const [mode, setMode] = React.useState('department');
      const [departmentId, setDepartmentId] = React.useState('');
      const [employeeId, setEmployeeId] = React.useState('');
      const [search, setSearch] = React.useState('');
      const [resultSearch, setResultSearch] = React.useState('');
      const [status, setStatus] = React.useState('qualified');
      const [availability, setAvailability] = React.useState('all');
      const [page, setPage] = React.useState(1);
      const model = React.useMemo(() => buildModel(data, helpers), [data]);
      const byDepartment = mode === 'department';
      const selectedId = byDepartment ? departmentId : employeeId;
      const choices = byDepartment ? model.departments : model.employees;
      const selected = choices.find(item => item.id === selectedId);
      const filteredChoices = choices.filter(item => includes(item.name + ' ' + (item.registration || ''), search));
      const rows = !selected ? [] : byDepartment
        ? model.employees.map(person => model.assess(person, selected))
        : model.departments.map(department => model.assess(selected, department));
      const qualified = rows.filter(row => row.qualified);
      const available = qualified.filter(row => row.available);
      const unconfigured = rows.filter(row => row.status === 'unconfigured');
      const found = rows.filter(row => (status === 'all' || row.status === status)
        && (availability === 'all' || (availability === 'available' ? !row.away : row.away))
        && includes(byDepartment ? row.person.name + ' ' + (row.person.registration || '') + ' ' + (data.departments.find(d => d.id === row.person.departmentId)?.name || '') : row.department.name, resultSearch))
        .sort((a, b) => Number(b.qualified) - Number(a.qualified) || (b.percent || 0) - (a.percent || 0)
          || (byDepartment ? a.person.name.localeCompare(b.person.name, 'pt-BR') : a.department.name.localeCompare(b.department.name, 'pt-BR')));
      const pages = Math.max(1, Math.ceil(found.length / 20));
      const currentPage = Math.min(page, pages);
      const reset = () => { setPage(1); setResultSearch(''); setStatus('qualified'); setAvailability('all'); };
      const changeMode = next => { setMode(next); setSearch(''); reset(); };
      function exportResults() {
        const table = [['Pessoa', 'Matrícula', 'Departamento consultado', 'Setor atual', 'Cursos válidos / exigidos', 'Qualificação', 'Disponibilidade', 'Cursos pendentes'],
          ...found.map(row => [row.person.name, row.person.registration || '', row.department.name,
            data.departments.find(d => d.id === row.person.departmentId)?.name || 'Sem setor',
            `${row.matched}/${row.courses.length}`, row.status === 'unconfigured' ? 'Sem requisitos definidos' : row.qualified ? 'Qualificado' : 'Pendente',
            row.away ? 'Afastado' : 'Sem afastamento ativo', row.missing.map(course => course.title).join(' | ')])];
        const cell = value => '"' + String(value).replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"';
        const url = URL.createObjectURL(new Blob(['\uFEFF' + table.map(row => row.map(cell).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a'); link.href = url; link.download = 'gestao-estrategica.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      return h('div', { className: 'sese-strategy' },
        h('div', { className: 'strategy-intro' },
          h('div', null, h('strong', null, 'A pessoa certa para cada área'), h('p', null, 'Cruze os cursos válidos da equipe com os requisitos de cada departamento.')),
          h('span', { className: 'strategy-live' }, '● Consulta dos cadastros atuais')),
        h('div', { className: 'strategy-modes', role: 'group', 'aria-label': 'Tipo de consulta' },
          h('button', { type: 'button', 'aria-pressed': byDepartment, onClick: () => changeMode('department') }, 'Por departamento'),
          h('button', { type: 'button', 'aria-pressed': !byDepartment, onClick: () => changeMode('person') }, 'Por pessoa')),
        h('div', { className: 'strategy-layout' },
          h('aside', { className: 'panel strategy-picker' },
            h('h2', null, byDepartment ? '1. Escolha o departamento' : '1. Escolha a pessoa'),
            h('label', null, byDepartment ? 'Buscar departamento' : 'Buscar nome ou matrícula',
              h('input', { type: 'search', value: search, placeholder: byDepartment ? 'Ex.: Recebimento' : 'Nome ou matrícula…', onChange: event => setSearch(event.target.value) })),
            h('select', { size: 8, value: filteredChoices.some(item => item.id === selectedId) ? selectedId : '', 'aria-label': byDepartment ? 'Selecionar departamento' : 'Selecionar pessoa', onChange: event => { (byDepartment ? setDepartmentId : setEmployeeId)(event.target.value); reset(); } },
              h('option', { value: '', disabled: true }, filteredChoices.length ? 'Selecione para consultar' : 'Nenhum resultado'),
              filteredChoices.map(item => h('option', { key: item.id, value: item.id }, item.name + (!byDepartment && item.registration ? ' · ' + item.registration : '')))),
            h('small', null, `${filteredChoices.length} de ${choices.length} ${byDepartment ? 'departamentos' : 'pessoas'}`),
            h('details', { className: 'strategy-rule' }, h('summary', null, 'Como a qualificação é calculada?'),
              h('p', null, 'É necessário ter todos os cursos exigidos válidos. São considerados os cursos da matriz, os pré-requisitos do departamento e os cursos globais, respeitando as exclusões cadastradas. Cursos registrados no cadastro da pessoa seguem a regra atual do sistema.'),
              h('p', null, 'Não exige nível 3 ou 4. Afastamento é mostrado separadamente. Um departamento sem requisitos definidos não gera qualificação automática.'))),
          h('section', { className: 'strategy-results', 'aria-label': 'Resultados da consulta' },
            !selected ? h('div', { className: 'panel strategy-empty' }, h('span', { 'aria-hidden': true }, '⌕'),
              h('h2', null, byDepartment ? 'Quem pode atuar nesta área?' : 'Onde esta pessoa pode atuar?'),
              h('p', null, byDepartment ? 'Selecione um departamento para consultar toda a equipe, inclusive pessoas de outras áreas.' : 'Selecione uma pessoa para comparar seus cursos com todos os departamentos.')) : h(React.Fragment, null,
              h('div', { className: 'strategy-selected' }, h('div', null, h('small', null, byDepartment ? 'DEPARTAMENTO CONSULTADO' : 'PESSOA CONSULTADA'), h('h2', null, selected.name),
                !byDepartment && h('p', null, `Matrícula ${selected.registration || 'não informada'} · ${data.departments.find(d => d.id === selected.departmentId)?.name || 'Sem setor'}`)),
                h('button', { className: 'btn outline', type: 'button', onClick: () => byDepartment ? onDepartment(selected.id) : onPerson(selected.id) }, byDepartment ? 'Gerenciar requisitos' : 'Ver cadastro')),
              h('div', { className: 'strategy-stats' },
                h('div', null, h('strong', null, qualified.length), h('span', null, byDepartment ? 'Pessoas qualificadas' : 'Departamentos compatíveis')),
                h('div', null, h('strong', null, available.length), h('span', null, byDepartment ? 'Qualificadas sem afastamento' : 'Compatíveis sem afastamento')),
                h('div', null, h('strong', null, byDepartment ? (model.requirements.get(selected.id) || []).length : rows.filter(row => row.status === 'pending').length), h('span', null, byDepartment ? 'Cursos exigidos' : 'Departamentos com pendências'))),
              byDepartment && !(model.requirements.get(selected.id) || []).length && h('p', { className: 'strategy-notice', role: 'status' }, 'Este departamento ainda não tem cursos exigidos. Defina os requisitos para identificar pessoas qualificadas.'),
              !byDepartment && unconfigured.length > 0 && h('p', { className: 'strategy-notice' }, `${unconfigured.length} departamento(s) sem requisitos definidos. Eles não são considerados compatíveis automaticamente.`),
              h('div', { className: 'panel strategy-result-panel' },
                h('div', { className: 'strategy-filters' },
                  h('label', null, 'Pesquisar resultados', h('input', { type: 'search', value: resultSearch, placeholder: byDepartment ? 'Nome, matrícula ou setor atual…' : 'Nome do departamento…', onChange: event => { setResultSearch(event.target.value); setPage(1); } })),
                  h('label', null, 'Qualificação', h('select', { value: status, onChange: event => { setStatus(event.target.value); setPage(1); } },
                    [['qualified', 'Somente qualificados'], ['pending', 'Com pendências'], ['unconfigured', 'Sem requisitos'], ['all', 'Todos']].map(([value, label]) => h('option', { key: value, value }, label)))),
                  h('label', null, 'Disponibilidade', h('select', { value: availability, onChange: event => { setAvailability(event.target.value); setPage(1); } },
                    [['all', 'Todos'], ['available', 'Sem afastamento ativo'], ['away', 'Afastados']].map(([value, label]) => h('option', { key: value, value }, label))))),
                h('div', { className: 'strategy-result-heading' }, h('strong', { role: 'status', 'aria-live': 'polite' }, `${found.length} resultado(s)`),
                  h('button', { type: 'button', className: 'text-link', disabled: !found.length, onClick: exportResults }, 'Exportar consulta')),
                !found.length ? h('div', { className: 'strategy-no-results' }, h('p', null, 'Nenhum resultado com os filtros selecionados.'),
                  h('button', { className: 'btn outline', type: 'button', onClick: () => { setStatus('all'); setAvailability('all'); setResultSearch(''); setPage(1); } }, 'Ver todos e analisar pendências')) :
                  h('div', { className: 'strategy-cards' }, found.slice((currentPage - 1) * 20, currentPage * 20).map(row => h('article', { className: 'strategy-card', key: row.person.id + '|' + row.department.id },
                    h('div', { className: 'strategy-card-heading' }, h('div', null,
                      h('h3', null, byDepartment ? row.person.name : row.department.name),
                      byDepartment && h('p', null, `Matrícula ${row.person.registration || '—'} · ${data.departments.find(d => d.id === row.person.departmentId)?.name || 'Sem setor'}`)),
                      h('span', { className: 'strategy-badge ' + row.status }, row.qualified ? 'Qualificado' : row.status === 'unconfigured' ? 'Sem requisitos' : 'Pendente')),
                    h('div', { className: 'strategy-progress-text' }, h('span', null, row.courses.length ? `${row.matched} de ${row.courses.length} cursos exigidos válidos` : 'Requisitos ainda não definidos'),
                      row.percent !== null && h('strong', null, row.percent + '%')),
                    row.percent !== null && h('div', { className: 'strategy-progress', 'aria-hidden': true }, h('i', { style: { width: row.percent + '%' } })),
                    h('div', { className: 'strategy-card-notes' }, h('span', { className: row.away ? 'strategy-warning' : '' }, row.away ? 'Afastado · indisponível no momento' : 'Sem afastamento ativo'),
                      row.refresh && h('span', { className: 'strategy-warning' }, 'Reciclagem após afastamento pendente')),
                    h('details', null, h('summary', null, row.missing.length ? `Ver ${row.missing.length} curso(s) pendente(s) e requisitos` : 'Ver requisitos e cursos válidos'),
                      !row.courses.length ? h('p', null, 'Defina os cursos exigidos no cadastro do departamento.') : h('ul', { className: 'strategy-course-list' }, row.courses.map(course => h('li', { key: course.id },
                        h('span', null, course.title), h('strong', { className: row.missing.some(item => item.id === course.id) ? 'strategy-warning' : '' }, row.missing.some(item => item.id === course.id) ? 'Pendente ou vencido' : 'Válido'))))),
                    h('div', { className: 'strategy-card-actions' }, h('button', { type: 'button', className: 'text-link', onClick: () => {
                      if (byDepartment) { setEmployeeId(row.person.id); changeMode('person'); } else { setDepartmentId(row.department.id); changeMode('department'); }
                    } }, byDepartment ? 'Ver outras áreas desta pessoa →' : 'Ver pessoas desta área →'))))),
                pages > 1 && h('div', { className: 'strategy-pagination' },
                  h('button', { type: 'button', className: 'btn outline', disabled: currentPage === 1, onClick: () => setPage(currentPage - 1) }, 'Anterior'),
                  h('span', null, `Página ${currentPage} de ${pages}`),
                  h('button', { type: 'button', className: 'btn outline', disabled: currentPage === pages, onClick: () => setPage(currentPage + 1) }, 'Próxima')))))));
    };
  };
})();
