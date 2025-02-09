// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  auth,
  Timestamp as FirestoreTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
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
  measurementId: "G-LQ4J4TFSZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseauth = getAuth(app);
const db = getFirestore(app);

const addPeriodData = async (start_date) => {
  if (!(start_date instanceof Date) || isNaN(start_date.getTime())) {
    console.log("Invalid start date", start_date);
  }
  const user = firebaseauth.currentUser;
  if (user) {
    const uid = user.uid;

    try {
      // Fetch the user's cycle length from the userProfiles collection
      const userProfileRef = doc(db, "userProfiles", uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        const userProfile = userProfileSnap.data();
        const cycleLength = userProfile.cycleLength;

        // Calculate ovulation date and next period date
        const ovulationDate = new Date(start_date);
        ovulationDate.setDate(
          ovulationDate.getDate() + Math.floor(cycleLength / 2)
        );

        const nextPeriodDate = new Date(start_date);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

        // Create the periodData object
        const periodData = {
          userId: uid,
          start_date: Timestamp.fromDate(start_date),
          cycle_length: cycleLength,
          ovulation_date: Timestamp.fromDate(ovulationDate),
          next_period_date: Timestamp.fromDate(nextPeriodDate),
          period_days: [], //initialize period_days asab empty array
        };
        //create period days array
        const periodDaysArray = [];
        for (let i = 0; i < 7; i++) {
          //assuming a 7 day period. adjust as needed
          const periodDayDate = new Date(start_date);
          periodDayDate.setDate(periodDayDate.getDate() + i);
          periodDaysArray.push({
            date: Timestamp.fromDate(periodDayDate),
            day: i + 1, //day number with the period
          });
        }
        periodData.period_days = periodDaysArray;
        // Save the data in the periodData collection with a unique ID
        await addDoc(collection(db, "periodData"), periodData);

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
    //create a query to fetch only the current user's data
    const q = query(periodDataRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const userPeriodData = [];
    querySnapshot.forEach((doc) => {
      userPeriodData.push({ id: doc.id, ...doc.data() });
    });

    if (userPeriodData.length > 0) {
      return userPeriodData[0]; // Return the latest period data
    } else {
      console.log("No period data found for the user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching period data:", error);
    throw error;
  }
};
export {
  firebaseauth,
  db,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  addPeriodData,
  fetchPeriodData,
  FirestoreTimestamp,
};
