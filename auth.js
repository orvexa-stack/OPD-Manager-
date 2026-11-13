import { auth, db } from "../shared/database.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
export const onAuth = cb => onAuthStateChanged(auth, cb);
export const logout = () => signOut(auth);
export const getProfile = async uid => { const s = await getDoc(doc(db, "users", uid)); return s.exists() ? s.data() : null; };
export function renderLogin(app) {
  app.innerHTML = `<main style="max-width:420px"><div class="card"><h2>WELLCARE</h2><p>Better Health Through Better Care</p>
  <form id="f"><label>Email</label><input name="email" type="email" required>
  <label>Password</label><input name="pw" type="password" required minlength="8">
  <div id="reg" hidden><label>Full name</label><input name="name"><label>Mobile</label><input name="mobile"></div>
  <p class="err" id="e"></p><button>Login / Register</button> <button type="button" class="alt" id="t">Patient registration</button></form></div></main>`;
  let reg = false; const f = app.querySelector("#f"), e = app.querySelector("#e");
  app.querySelector("#t").onclick = () => { reg = !reg; app.querySelector("#reg").hidden = !reg; };
  f.onsubmit = async ev => { ev.preventDefault(); const d = new FormData(f);
    try {
      if (!reg) return await signInWithEmailAndPassword(auth, d.get("email"), d.get("pw"));
      const c = await createUserWithEmailAndPassword(auth, d.get("email"), d.get("pw"));
      // Rules only allow self-created users to have role PATIENT. Staff roles are assigned by the clinic admin in Firestore.
      await setDoc(doc(db, "users", c.user.uid), { role: "PATIENT", name: d.get("name"), mobile: d.get("mobile"), createdAt: serverTimestamp() });
      location.reload();
    } catch (x) { e.textContent = x.message; } };
}
