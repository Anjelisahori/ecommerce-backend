// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // ✅ Aquí estaba el problema

const firebaseConfig = {
  apiKey: "AIzaSyCRWj9BoNh-ZhOwsT4M-KiRhEp9BaFe-Es",
  authDomain: "fisioplus-4a3a5.firebaseapp.com",
  projectId: "fisioplus-4a3a5",
  storageBucket: "fisioplus-4a3a5.firebasestorage.app",
  messagingSenderId: "1717165715",
  appId: "1:1717165715:web:0a23ec910b91373123b766",
  measurementId: "G-VMLX73ZTHY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
