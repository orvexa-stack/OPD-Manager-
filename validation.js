export function validatePatient(p) {
  const e = [];
  if (!p.name || p.name.trim().length < 2) e.push("Name required");
  if (!(Number(p.age) >= 0 && Number(p.age) <= 120)) e.push("Valid age required");
  if (!["Male","Female","Other"].includes(p.sex)) e.push("Sex required");
  if (!/^\+?\d{10,13}$/.test(p.mobile||"")) e.push("Valid mobile required");
  return e;
}
