import { db, nextCounter, audit } from "../shared/database.js";
import { addDoc, updateDoc, doc, getDoc, collection, query, where, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { STATUS_FLOW, today, esc } from "../shared/utilities.js";
// Reused by the doctor dashboard (read-only queue).
export function watchQueue(date, cb) {
  return onSnapshot(query(collection(db, "appointments"), where("date", "==", date)),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.number - b.number)));
}
export function renderAppointments(v, ctx) {
  v.innerHTML = `<form class="card" id="f"><h3>New appointment / walk-in</h3><div class="grid">
  <div><label>Patient ID</label><input name="pid" placeholder="WC1001"></div><div><label>Date</label><input name="date" type="date" value="${today()}"></div>
  <div><label>Type</label><select name="walkin"><option value="">Booked</option><option value="1">Walk-in (arrived)</option></select></div></div>
  <p class="err" id="e"></p><button>Create</button></form><div class="card"><h3>Today's queue</h3><div id="list"></div></div>`;
  const e = v.querySelector("#e");
  v.querySelector("#f").onsubmit = async ev => { ev.preventDefault(); const d = Object.fromEntries(new FormData(ev.target));
    const ps = await getDoc(doc(db, "patients", d.pid.trim().toUpperCase()));
    if (!ps.exists()) { e.textContent = "Patient not found. Register first."; return; }
    const p = ps.data(), number = await nextCounter("appt_" + d.date);
    const ref = await addDoc(collection(db, "appointments"), { patientId: p.patientId, patientName: p.name, patientUid: p.uid ?? null, date: d.date, number,
      walkIn: !!d.walkin, status: d.walkin ? "Arrived" : "Booked", createdAt: serverTimestamp() });
    await audit("Appointment created", ref.id, ctx.profile.role); e.textContent = ""; };
  const list = v.querySelector("#list");
  watchQueue(today(), rows => { list.innerHTML = rows.length ? "" : "<p>No appointments today.</p>";
    for (const a of rows) { const next = STATUS_FLOW[STATUS_FLOW.indexOf(a.status) + 1];
      const open = ["Booked","Arrived","Waiting"].includes(a.status); // later statuses are driven by the doctor/pharmacy phases
      const r = document.createElement("div"); r.className = "row";
      r.innerHTML = `<span>#${a.number} ${esc(a.patientName)} <small>${esc(a.patientId)}</small> <span class="badge">${esc(a.status)}</span></span>
      <span>${open ? `<button data-n>→ ${next}</button> <button class="danger" data-c>Cancel</button>` : ""}</span>`;
      const n = r.querySelector("[data-n]"), c = r.querySelector("[data-c]");
      if (n) n.onclick = () => updateDoc(doc(db, "appointments", a.id), { status: next });
      if (c) c.onclick = async () => { await updateDoc(doc(db, "appointments", a.id), { status: "Cancelled" }); audit("Appointment cancelled", a.id, ctx.profile.role); };
      list.append(r); } });
}
