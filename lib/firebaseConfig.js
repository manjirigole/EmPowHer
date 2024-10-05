// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjUSxoTyE0kWXht1wGnlv3Cc-uJ6cg_Ys",
  authDomain: "empowher-33037.firebaseapp.com",
  projectId: "empowher-33037",
  storageBucket: "empowher-33037.appspot.com",
  messagingSenderId: "1076005394707",
  appId: "1:1076005394707:web:307071c2d1f3afbfe522e6",
  measurementId: "G-THMNNEW53E"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
