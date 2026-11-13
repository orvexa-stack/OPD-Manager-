// Provider-agnostic layer. Writes a queue record; a server-side worker (Cloud Function) delivers via any SMS/WhatsApp provider.
import { db } from "./database.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
export const notify = (type, toMobile, payload) =>
  addDoc(collection(db, "notifications"), { type, toMobile, payload, status: "queued", at: serverTimestamp() });
