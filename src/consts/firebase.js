import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// AQUI DEBE IR TU API DE FIRESTORE
export const firebaseConfig = {
  apiKey: "AIzaSyCgowdtI3I6V6ZlL0EHbEpGr7Yr2AKWUoo",
  authDomain: "app-ss-c02f8.firebaseapp.com",
  projectId: "app-ss-c02f8",
  storageBucket: "app-ss-c02f8.appspot.com",
  messagingSenderId: "467509216700",
  appId: "1:467509216700:web:367a20948f4158306717b9"
};
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);