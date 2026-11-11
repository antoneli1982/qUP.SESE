const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const context = { window: {}, Set, Map, Date,
  Xo: () => '2026-11-11',
  YD: (end, start = '2026-11-11') => Math.round((new Date(end) - new Date(start)) / 86400000),
  seseSameName: (a,b) => a.toLowerCase() === b.toLowerCase(), seseText: s => s.toLowerCase() };
vm.createContext(context);
function segment(start, end) { return html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start))); }
vm.runInContext(segment('function seseDepartmentPrerequisiteIds(', '// Matriz de competências do departamento:'), context);
vm.runInContext(segment('function seseDepartmentMatrixLinks(', 'function sesePolyMatrix('), context);
vm.runInContext(segment('function seseAbsence(', 'function SeseAbsenceBadge('), context);
vm.runInContext(fs.readFileSync('strategy.js', 'utf8'), context);
const data = { departments: [{id:'d1',name:'Recebimento',prerequisiteTrainingIds:['c1'],matrixCourses:[{trainingId:'c2'}]},
  {id:'d2',name:'Expedição',excludedPrerequisiteTrainingIds:['global']}, {id:'d3',name:'Picking',prerequisiteTrainingIds:['c1']}],
  employees: [{id:'p1',name:'Ana',departmentId:'d2'}, {id:'p2',name:'Bruno',departmentId:'d1'},
    {id:'p3',name:'Carla',departmentId:'d2',prerequisiteTrainingIds:['c1','c2','global']}],
  trainingCatalog:[{id:'c1',title:'Curso A'},{id:'c2',title:'Curso B'},{id:'global',title:'Integração',global:true}],
  departmentTrainings:[], courseLevels:[{employeeId:'p2',trainingId:'c2',level:4}],
  trainings:[{employeeId:'p1',templateId:'c1',date:'2026-11-10',expiry:'2026-11-11'},
    {employeeId:'p1',templateId:'c2',date:'2026-11-10',expiry:''}, {employeeId:'p1',templateId:'global',expiry:''},
    {employeeId:'p2',templateId:'c1',expiry:'2026-11-10'}, {employeeId:'p2',templateId:'global',expiry:''}],
  absences:[{employeeId:'p3',startDate:'2026-11-01',endDate:''}] };
const before = JSON.stringify(data);
const helpers = {courseIds:context.seseEmployeeCourseIds,absence:context.seseAbsence,links:context.seseDepartmentMatrixLinks};
const model = context.window.seseStrategyModel(data, helpers);
const assess = (p,d) => model.assess(data.employees.find(x=>x.id===p),data.departments.find(x=>x.id===d));
assert.equal(assess('p1','d1').qualified,true,'Recent training qualifies without level 3');
assert.equal(assess('p1','d1').courses.length,3,'Matrix, prerequisites and globals combined');
assert.equal(assess('p1','d1').available,true,'Can qualify outside own department');
assert.equal(assess('p2','d1').qualified,false,'Expired course and manual level cannot grant qualification');
assert.equal(assess('p2','d1').missing.length,2);
assert.equal(assess('p3','d1').qualified,true,'Existing employee course assignments honored');
assert.equal(assess('p3','d1').available,false,'Absence separated from qualification');
assert.equal(assess('p1','d2').qualified,false,'No requirements does not grant automatic qualification');
assert.equal(assess('p1','d2').percent,null);
assert.equal(assess('p1','d3').qualified,true,'Expiration today remains valid');
assert.equal(JSON.stringify(data),before,'Read-only model');
data.trainings = data.trainings.filter(x=>!(x.employeeId==='p1'&&x.templateId==='c2'));
assert.equal(context.window.seseStrategyModel(data,helpers).assess(data.employees[0],data.departments[0]).qualified,false,'New data recalculates qualification');
console.log('12 checks passed: validity, requirements, cross-department, no requirements, absence, manual levels, read-only and refresh.');
