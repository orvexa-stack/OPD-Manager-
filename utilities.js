export const STATUS_FLOW = ["Booked","Arrived","Waiting","With Doctor","Consultation Completed","Prescription Sent","Pharmacy","Completed"];
export const today = () => new Date().toISOString().slice(0,10);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function shell(app, {profile, tabs}, logout) {
  app.innerHTML = `<header class="top"><div><b>WELLCARE</b><small>Better Health Through Better Care</small></div>
  <div>${esc(profile.name)} · ${profile.role} <button class="alt" id="lo">Logout</button></div></header>
  <main><nav class="tabs">${tabs.map(t=>`<button class="alt" data-t="${t.id}">${t.label}</button>`).join("")}</nav><section id="view"></section></main>`;
  app.querySelector("#lo").onclick = logout;
  const view = app.querySelector("#view");
  const open = id => tabs.find(t=>t.id===id).render(view);
  app.querySelectorAll("[data-t]").forEach(b => b.onclick = () => open(b.dataset.t));
  open(tabs[0].id);
}
