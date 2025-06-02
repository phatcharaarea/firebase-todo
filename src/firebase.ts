// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLTzf9AVhLczint-dT07S8myymok-wzWA",
  authDomain: "fir-todo-f8643.firebaseapp.com",
  projectId: "fir-todo-f8643",
  storageBucket: "fir-todo-f8643.firebasestorage.app",
  messagingSenderId: "699757724155",
  appId: "1:699757724155:web:1a273e3c43c8b51204cb5e",
  measurementId: "G-L97J0BVJ2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);