const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const c = { Xo: () => '2026-11-12', seseAbsence: () => ({}), Be: {useState: x => [typeof x === 'function' ? x() : x, () => {}], useEffect: () => {}}, document: {}, _jsx: (type, props) => ({type, ...props}), _jsxs: (type, props) => ({type, ...props}) };
vm.createContext(c);
function load(a,b) { vm.runInContext(html.slice(html.indexOf(a), html.indexOf(b, html.indexOf(a))), c); }
load('function seseDepartmentPrerequisiteIds(', '// Matriz de competências do departamento:');
load('function seseDepartmentMatrixLinks(', '// M\\xEAs vigente da matriz:');
load('function seseText(', 'function seseExpiry(');
load('function SesePolyCourses(', 'function sesePolyPrint(');
const data = {departments:[{id:'d',name:'Expedição',prerequisiteTrainingIds:['a','b'],matrixCourses:[{trainingId:'c',demand:4}],matrixCourseOrder:['b','c','a']}], trainingCatalog:[{id:'a',title:'A'},{id:'b',title:'B'},{id:'c',title:'C'}],employees:[{id:'1',name:'Ana',departmentId:'d',admissionDate:'2025-01-01'},{id:'2',name:'Zelia',departmentId:'d',admissionDate:'2020-01-01'},{id:'3',name:'Bia',departmentId:'d',admissionDate:''}],trainings:[],absences:[]};
assert.deepEqual(Array.from(c.sesePolyMatrix(data,'d').employees,x=>x.id),['2','1','3']);
assert.deepEqual(Array.from(c.seseDepartmentMatrixLinks(data,'d'),x=>x.trainingId),['b','c','a']);
function flatten(n) { if(!n || typeof n !== 'object') return []; return [n,...[n.children].flat(Infinity).flatMap(flatten)]; }
(async () => {
 let saved;
 const view=c.SesePolyCourses({data,department:data.departments[0],onClose:()=>{},onSave:async (links,order)=>{saved={matrixCourses:links,matrixCourseOrder:order};return true;}});
 await flatten(view).find(n=>n.children==='Salvar cursos da matriz').onClick();
 Object.assign(data.departments[0],JSON.parse(JSON.stringify(saved)));
 assert.deepEqual(Array.from(c.seseDepartmentMatrixLinks(data,'d'),x=>x.trainingId),['b','c','a']);
 assert.equal(data.departments[0].matrixCourses[0].demand,4);
 data.departments[0].prerequisiteTrainingIds=['a'];
 assert.deepEqual(Array.from(c.seseDepartmentMatrixLinks(data,'d'),x=>x.trainingId),['c','a'],'Removed requirements must not become extra courses');
 const foot=html.slice(html.indexOf('className: "sese-poly-foot"'),html.indexOf('function HA('));
 assert(foot.indexOf('sese-poly-legend')<foot.indexOf('sese-poly-sign'));
 assert(html.includes('value: i === "departments" ? seseDeptQuery : g'));
 const search=html.slice(html.indexOf('  const seseDeptTitles ='),html.indexOf('  const seseMoPlan ='));
 c.e=data;c.seseDeptQuery='expedicao';
 assert.equal(vm.runInContext('(function(){'+search+';return seseDeptFound.length;})()',c),1);
 c.seseDeptQuery='inexistente';
 assert.equal(vm.runInContext('(function(){'+search+';return seseDeptFound.length;})()',c),0);
 let count=0;
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) { if(m[2].trim() && !/application\/ld\+json/.test(m[1])) {new vm.Script(m[2]);count++;} }
 console.log('Passed: admission ordering, missing dates, course order save/reload, demand preservation, requirement removal, footer order, sector search and '+count+' script syntax checks.');
})();
