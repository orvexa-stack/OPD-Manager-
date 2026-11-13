import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, runTransaction, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";
export const fbApp = initializeApp(firebaseConfig);
export const db = getFirestore(fbApp);
export const auth = getAuth(fbApp);
export async function nextCounter(name, start = 0) {
  const ref = doc(db, "counters", name);
  return runTransaction(db, async tx => {
    const n = ((await tx.get(ref)).data()?.value ?? start) + 1;
    tx.set(ref, { value: n }); return n;
  });
}
// Append-only: rules allow create, never update/delete.
export const audit = (action, recordId, role) => addDoc(collection(db, "auditLogs"),
  { uid: auth.currentUser.uid, role, action, recordId, at: serverTimestamp() });
