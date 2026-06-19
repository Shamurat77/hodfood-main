import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // FIRESTORE QO'SHILDI

const firebaseConfig = {
  apiKey: "AIzaSyCBULKOvd9Mp5GPn2t27qO5zguHDiE07Lo",
  authDomain: "fastfood001-d27cc.firebaseapp.com",
  projectId: "fastfood001-d27cc",
  storageBucket: "fastfood001-d27cc.firebasestorage.app",
  messagingSenderId: "1000887085827",
  appId: "1:1000887085827:web:bed9debdb63427f38b1736",
  measurementId: "G-9XC15PWHSZ"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // BAZANI EKSPORT QILDIK