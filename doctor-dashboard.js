import { shell, today, esc } from "../shared/utilities.js";
import { logout } from "../auth/auth.js";
import { watchQueue } from "../compounder/appointments.js";
export const mount = (app, ctx) => shell(app, { profile: ctx.profile, tabs: [
  { id: "q", label: "Waiting Queue", render: v => { v.innerHTML = '<div class="card" id="l"></div>';
    watchQueue(today(), rows => v.querySelector("#l").innerHTML = rows.filter(a => ["Waiting","With Doctor"].includes(a.status))
      .map(a => `<div class="row"><span>#${a.number} ${esc(a.patientName)}</span><span class="badge">${esc(a.status)}</span></div>`).join("") || "<p>No patients waiting.</p>"); } } ] }, logout);
// Phase 2: consultation.js, prescription.js, pdrugs.js plug in as extra tabs here.
