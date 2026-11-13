import { shell } from "../shared/utilities.js";
import { logout } from "../auth/auth.js";
export const mount = (app, ctx) => shell(app, { profile: ctx.profile, tabs: [
  { id: "home", label: "Home", render: v => v.innerHTML = '<div class="card">Signed in as pharmacist. Features arrive in a later phase.</div>' } ] }, logout);
