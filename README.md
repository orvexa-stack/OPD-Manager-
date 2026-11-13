# WELLCARE — Better Health Through Better Care
Stack: vanilla ES modules (no build step) + Firebase Auth + Firestore + security rules. Entry: index.html.
## Setup (required)
1. Create a Firebase project; enable Email/Password auth and Firestore.
2. Paste web config into js/shared/firebase-config.js and set CLINIC details.
3. Publish firestore.rules (Console > Firestore > Rules).
4. Create staff: add user in Auth, then in Firestore create users/{uid} = {role:"DOCTOR"|"COMPOUNDER"|"PHARMACIST", name}.
5. Serve over HTTPS (GitHub Pages works) or `python -m http.server`.
## Phase 1 status
Done: login, patient self-registration, role routing, rules-enforced roles, patient registration/edit, appointments, live queue, audit log, notification queue layer.
Not yet: consultation, P-drugs, prescriptions, pharmacy, patient booking/OTP, reports (placeholder files exist).
Known gaps: patient booking needs a Cloud Function (counters are compounder-only); doctors cannot yet write visits/prescriptions in rules (added in Phase 2).
