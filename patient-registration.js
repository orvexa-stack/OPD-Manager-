import { db, nextCounter, audit } from "../shared/database.js";
import { doc, setDoc, getDocs, query, collection, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { validatePatient } from "../shared/validation.js";
import { esc } from "../shared/utilities.js";
export function renderRegistration(v, ctx) {
  v.innerHTML = `<div class="card"><h3>Find patient (ID or mobile)</h3><div class="grid"><input id="q" placeholder="WC1001 or mobile"><button id="s">Search</button></div><div id="res"></div></div>
  <form class="card" id="f"><h3 id="ft">Register patient</h3><div class="grid">
  <div><label>Name</label><input name="name"></div><div><label>Age</label><input name="age" type="number"></div>
  <div><label>Sex</label><select name="sex"><option>Male</option><option>Female</option><option>Other</option></select></div>
  <div><label>Mobile</label><input name="mobile"></div><div><label>Address</label><input name="address"></div></div>
  <input type="hidden" name="patientId"><p class="err" id="e"></p><button>Save</button></form>`;
  const f = v.querySelector("#f"), e = v.querySelector("#e");
  v.querySelector("#s").onclick = async () => { const q = v.querySelector("#q").value.trim();
    const field = /^WC/i.test(q) ? "patientId" : "mobile";
    const snap = await getDocs(query(collection(db, "patients"), where(field, "==", field === "patientId" ? q.toUpperCase() : q)));
    const res = v.querySelector("#res"); res.innerHTML = snap.empty ? "<p>No match</p>" : "";
    snap.forEach(d => { const p = d.data(); const r = document.createElement("div"); r.className = "row";
      r.innerHTML = `<span>${esc(p.patientId)} · ${esc(p.name)} · ${esc(p.age)}/${esc(p.sex)}</span><button class="alt">Edit</button>`;
      r.querySelector("button").onclick = () => { for (const k of ["name","age","sex","mobile","address","patientId"]) f.elements[k].value = p[k] ?? ""; v.querySelector("#ft").textContent = "Edit demographics"; };
      res.append(r); }); };
  f.onsubmit = async ev => { ev.preventDefault(); const p = Object.fromEntries(new FormData(f)); const errs = validatePatient(p);
    if (errs.length) { e.textContent = errs.join(", "); return; }
    const isNew = !p.patientId; if (isNew) p.patientId = "WC" + await nextCounter("patientId", 1000);
    p.age = Number(p.age); // Demographics only: diagnosis/prescriptions live in collections the compounder cannot write.
    await setDoc(doc(db, "patients", p.patientId), { ...p, updatedAt: serverTimestamp() }, { merge: true });
    await audit(isNew ? "Patient registered" : "Patient demographic edited", p.patientId, ctx.profile.role);
    e.textContent = ""; f.reset(); v.querySelector("#ft").textContent = "Saved " + p.patientId; };
}
