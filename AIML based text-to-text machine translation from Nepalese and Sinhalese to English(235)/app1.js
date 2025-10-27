
// Mandatory Firebase/Firestore imports and setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app, db, auth;

window.onload = async () => {
try {
if (Object.keys(firebaseConfig).length > 0) {
app = initializeApp(firebaseConfig);
db = getFirestore(app);
auth = getAuth(app);
setLogLevel('Debug'); // Enable Firestore logging

// Mandatory authentication step
if (initialAuthToken) {
await signInWithCustomToken(auth, initialAuthToken);
} else {
await signInAnonymously(auth);
}
console.log("Firebase initialized and authenticated.");
} else {
console.warn("Firebase config not available. Proceeding without persistent storage.");
}
// The main application logic is defined globally in the script below
} catch (error) {
console.error("Firebase Initialization Error:", error);
}
};
