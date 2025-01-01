// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, auth } from "firebase/firestore";
import {collection, addDoc} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANndVipXrRo-Mm87ppxR5E5NJjrxGOqyc",
  authDomain: "empowher-two.firebaseapp.com",
  projectId: "empowher-two",
  storageBucket: "empowher-two.firebasestorage.app",
  messagingSenderId: "398297717023",
  appId: "1:398297717023:web:bf89236c4a1586550d782a",
  measurementId: "G-LQ4J4TFSZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseauth = getAuth(app);
const db = getFirestore(app);


export {firebaseauth, db, createUserWithEmailAndPassword, doc, setDoc, getDoc};