// CONFIGURATION REQUIRED: paste your Firebase web config (Console > Project settings > Your apps).
// Web config is public by design; real protection is firestore.rules. Never put Admin SDK keys or SMS/WhatsApp secrets here.
export const firebaseConfig = {
  apiKey: "REPLACE_ME", authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME", appId: "REPLACE_ME"
};
export const CLINIC = { name: "Your Clinic Name", address: "Clinic address", doctorReg: "" }; // used by print templates
