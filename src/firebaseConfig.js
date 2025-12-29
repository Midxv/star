import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // PASTE YOUR FIREBASE CONFIG KEYS HERE
    apiKey: "AIzaSyDfhTEGo9m10OknYQKqahg_kJWBKm7_HPo",
    authDomain: "starcards-eaf42.firebaseapp.com",
    projectId: "starcards-eaf42",
    storageBucket: "starcards-eaf42.firebasestorage.app",
    messagingSenderId: "144677301768",
    appId: "1:144677301768:web:2d9e50fedb800be5262bbd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);