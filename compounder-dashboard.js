import { shell } from "../shared/utilities.js";
import { logout } from "../auth/auth.js";
import { renderRegistration } from "./patient-registration.js";
import { renderAppointments } from "./appointments.js";
export const mount = (app, ctx) => shell(app, { profile: ctx.profile, tabs: [
  { id: "appt", label: "Appointments & Queue", render: v => renderAppointments(v, ctx) },
  { id: "reg", label: "Patient Registration", render: v => renderRegistration(v, ctx) } ] }, logout);
