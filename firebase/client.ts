// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyC4cHwzPjC23wO29I84v4hsywrcdvzo-iI",
    authDomain: "prepwise-4067e.firebaseapp.com",
    projectId: "prepwise-4067e",
    storageBucket: "prepwise-4067e.firebasestorage.app",
    messagingSenderId: "581270936678",
    appId: "1:581270936678:web:5724abcb3c9e38986861a7",
    measurementId: "G-YYSEKC3MZJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
