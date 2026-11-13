import { onAuth, getProfile, renderLogin } from "./auth/auth.js";
const ROLES = { DOCTOR: "./doctor/doctor-dashboard.js", COMPOUNDER: "./compounder/compounder-dashboard.js",
  PHARMACIST: "./pharmacist/pharmacist-dashboard.js", PATIENT: "./patient/patient-dashboard.js" };
const app = document.getElementById("app");
onAuth(async user => {
  if (!user) return renderLogin(app);
  const profile = await getProfile(user.uid);
  if (!profile || !ROLES[profile.role]) { app.innerHTML = '<p class="msg">No role assigned to this account. Contact the clinic administrator.</p>'; return; }
  document.getElementById("role-css").href = `assets/css/${profile.role.toLowerCase()}.css`;
  (await import(ROLES[profile.role])).mount(app, { user, profile });
});
