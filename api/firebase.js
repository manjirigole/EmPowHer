// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  auth,
  getFirestore,
  doc,
  setDoc, // ✅ Ensure this is imported!
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  Firestore,
} from "firebase/firestore";

import symptoms from "@/app/symptomsTracker/symptoms";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANndVipXrRo-Mm87ppxR5E5NJjrxGOqyc",
  authDomain: "empowher-two.firebaseapp.com",
  projectId: "empowher-two",
  storageBucket: "empowher-two.appspot.com",
  messagingSenderId: "398297717023",
  appId: "1:398297717023:web:bf89236c4a1586550d782a",
  measurementId: "G-LQ4J4TFSZJ",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
//const analytics = getAnalytics(app);
const firebaseauth = getAuth(app);
const db = getFirestore(app);
/**Firebase Symptom Logging Update */
const logSymptoms = async (selectedSymptoms) => {
  const user = firebaseauth.currentUser;
  if (!user) {
    console.log("User is not authenticated");
    return;
  }

  try {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const userSymptomsRef = collection(
      db,
      "users",
      user.uid,
      "symptoms",
      date,
      "entries"
    );

    await addDoc(userSymptomsRef, {
      symptoms: selectedSymptoms,
      timestamp: Timestamp.now(),
    });

    console.log("Symptoms logged successfully");
  } catch (error) {
    console.error("Error logging symptoms:", error);
  }
};

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const addPeriodData = async (start_date) => {
  if (!(start_date instanceof Date) || isNaN(start_date.getTime())) {
    console.log("Invalid start date", start_date);
    return;
  }

  const user = firebaseauth.currentUser;
  if (user) {
    const uid = user.uid;

    try {
      const userProfileRef = doc(db, "userProfiles", uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        const { cycleLength } = userProfileSnap.data();

        const ovulationDate = new Date(start_date);
        ovulationDate.setDate(
          ovulationDate.getDate() + Math.floor(cycleLength / 2)
        );

        const nextPeriodDate = new Date(start_date);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

        const periodDaysArray = []; // Initialize outside the loop!
        const startDateCopy = new Date(start_date); // Create a copy!

        for (let i = 0; i < 7; i++) {
          const periodDayDate = new Date(startDateCopy); // Use the copy
          periodDayDate.setDate(startDateCopy.getDate() + i); // Increment the copy
          periodDaysArray.push({
            date: Timestamp.fromDate(periodDayDate),
            day: i + 1,
          });
        }

        const periodData = {
          userId: uid,
          start_date: Timestamp.fromDate(start_date),
          cycle_length: cycleLength,
          ovulation_date: Timestamp.fromDate(ovulationDate),
          next_period_date: Timestamp.fromDate(nextPeriodDate),
          period_days: periodDaysArray,
        };

        // Use addDoc to let Firestore generate the ID:
        await addDoc(collection(db, "periodData"), periodData); // Correct usage

        console.log("Period data saved successfully!");
      } else {
        console.log("User profile does not exist.");
      }
    } catch (error) {
      console.error("Failed to save period data:", error);
    }
  } else {
    console.log("User is not authenticated.");
  }
};

const fetchPeriodData = async (userId) => {
  try {
    const periodDataRef = collection(db, "periodData");
    const q = query(periodDataRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const userPeriodData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return userPeriodData.length > 0 ? userPeriodData[0] : null;
  } catch (error) {
    console.error("Error fetching period data:", error);
    throw error;
  }
};

/** Symptom Logging Functions 
const logSymptoms = async (selectedSymptoms) => {
  const user = firebaseauth.currentUser;
  if (!user) {
    console.log("User not authenticated.");
    return;
  }

  try {
    const userSymptomsRef = collection(db, "users", user.uid, "symptoms");
    await addDoc(userSymptomsRef, {
      symptoms: selectedSymptoms,
      timestamp: Timestamp.now(),
    });
    console.log("Symptoms logged successfully!");
  } catch (error) {
    console.error("Error logging symptoms:", error);
  }
};**/

// Exporting Firebase functionalities
export {
  firebaseauth,
  db,
  createUserWithEmailAndPassword,
  addPeriodData,
  fetchPeriodData,
  logSymptoms,
  Timestamp,
  doc,
  getDoc,
  auth,
  Firestore,
  setDoc,
};
