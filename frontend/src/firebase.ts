// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT8mYGT5OGkXSQbBy41hf58JtTD9ThaaE",
  authDomain: "ma-diplom.firebaseapp.com",
  projectId: "ma-diplom",
  storageBucket: "ma-diplom.appspot.com",
  messagingSenderId: "432412211328",
  appId: "1:432412211328:web:03cb25bd8d18e677744e65",
  measurementId: "G-C16ES1P53H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);
