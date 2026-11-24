const fs = require("node:fs");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");
const html = fs.readFileSync("index.html", "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
const ctx = vm.createContext({ window: { createSeseStrategy: () => null }, crypto: webcrypto, structuredClone, Intl, Date, setTimeout, clearTimeout });
const sheet = scripts.find(source => source.includes("make_xlsx_lib"));
vm.runInContext(sheet, ctx);
const app = scripts.find(source => source.includes("function Rh()"));
const end = app.indexOf("var Dn = B(le(), 1)");
if (end < 0) throw Error("Application entry point not found");
vm.runInContext(app.slice(0,end) + "window.api = { XLSX, dM, lc, uM, seseSyncPlan, seseApplyRoster, seseAbsence, sesePolyMatrix, HA };})();", ctx);
async function checkRoster(api) {
  const { XLSX, dM, lc, uM, seseSyncPlan, seseApplyRoster, seseAbsence, sesePolyMatrix, HA } = api;
  const equal = (a, b, message) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw Error(message); };
  const data = lc.parse(uM());
  data.employees.forEach(person => { person.registration = "00" + person.id.slice(1); });
  data.trainingCatalog.push({ id: "course", title: "Conferência", description: "" });
  data.departments[0].prerequisiteTrainingIds = ["course"];
  data.courseLevels = ["e1", "e2"].map(employeeId => ({ employeeId, trainingId: "course", level: 4 }));
  const current = lc.parse(data);
  const before = JSON.stringify(current);
  async function roster(people) {
    const sheet = XLSX.utils.aoa_to_sheet([["Matrícula", "Nome"], ...people.map(p => [p.registration, p.name])]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Colaboradores");
    const bytes = XLSX.write(book, { bookType: "xlsx", type: "array" });
    return dM({ name: "quadro.xlsx", size: bytes.byteLength, arrayBuffer: async () => bytes });
  }
  const newcomer = { name: "Pessoa nova", registration: "009" };
  const people = current.employees.filter(p => !["e1","e2"].includes(p.id)).concat(newcomer);
  const sheet = await roster(people);
  const plan = seseSyncPlan(current, sheet);
  equal(plan.review.map(r => r.person.id).sort(), ["e1","e2"], "Missing employees");
  equal(plan.added.map(p => p.name), [newcomer.name], "Single new employee");
  let blocked = false;
  try { seseApplyRoster(plan, {}); } catch { blocked = true; }
  equal(blocked, true, "All decisions are required");
  const choices = Object.fromEntries(plan.review.map(r => [r.key, r.person.id === "e1" ? "away" : "delete"]));
  const applied = lc.parse(seseApplyRoster(plan, choices).data);
  equal(JSON.stringify(current), before, "Preview must not mutate the source");
  const history = (d, id) => [d.employees.find(p => p.id === id), ...["trainings","evaluations","courseLevels"].map(k => d[k].filter(p => p.employeeId === id))];
  equal(history(applied,"e1"), history(current,"e1"), "Leave preserves profile and qualifications");
  equal(history(applied,"e2"), [undefined, [], [], []], "Explicit deletion removes only selected employee");
  equal(applied.absences.length, 1, "One open period");
  equal(sesePolyMatrix(applied,"d1").employees.some(p => p.id === "e1"), false, "Away excluded from matrix");
  equal(seseSyncPlan(applied,sheet).review.length, 0, "Repeat import must not reopen absence");
  const returned = await roster(people.concat({ name: "Ana nome atualizado", registration: "001" }));
  const returnPlan = seseSyncPlan(applied, returned);
  equal(returnPlan.review.map(r => [r.kind,r.person.id]), [["return","e1"]], "Matched by registration after a rename");
  const row = returnPlan.review[0];
  const stay = lc.parse(seseApplyRoster(returnPlan,{[row.key]:"stay"}).data);
  equal(stay.absences, applied.absences, "Declining preserves the open period");
  const again = seseSyncPlan(stay, returned);
  equal(again.review.length, 1, "Return is asked again on a later list");
  const active = lc.parse(seseApplyRoster(again,{[again.review[0].key]:"activate"}).data);
  equal(Boolean(seseAbsence(active,"e1").active), false, "Return closes period");
  equal(active.absences.length, 1, "Return keeps the period's history");
  equal(history(active,"e1").slice(1), history(current,"e1").slice(1), "Qualifications survive return");
  equal(active.employees.find(p => p.id === "e1").role, current.employees.find(p => p.id === "e1").role, "Narrow roster preserves missing fields");
  equal(sesePolyMatrix(active,"d1").employees.some(p => p.id === "e1"), true, "Return restores matrix membership");
  equal(HA(active).employees, HA(stay).employees + 1, "Return restores dashboard headcount");
  equal(seseSyncPlan(active,returned).review.length, 0, "No repeated return after activation");
}

checkRoster(ctx.window.api).then(() => console.log("Roster import, leave, return and matrix checks passed.")).catch(error => { console.error(error); process.exitCode = 1; });
