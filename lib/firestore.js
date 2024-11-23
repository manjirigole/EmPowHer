// lib/firestore.js
import { db, auth } from "./firebaseConfig"; // Make sure this file exports both db and auth
import { onAuthStateChanged } from "firebase/auth/cordova";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore"; // Import Firestore methods
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Register user with Firebase Auth
export async function createUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser = {
      uid: userCredential.user.uid,
      email,
      username,
      avatar: username.charAt(0).toUpperCase(),
    };
    // Add user to Firestore
    await addDoc(collection(db, "users"), newUser);
    return newUser;
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}
// Get current authenticated user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Unsubscribe after getting user
        if (user) {
          resolve(user);
        } else {
          resolve(null); // User is not signed in
        }
      },
      reject
    );
  });
};

// Sign In with Firebase Auth
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return { uid: user.uid, email: user.email };
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}

// Get Account
export async function getAccount(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const newPost = {
      title: form.title,
      thumbnail: form.thumbnail,
      video: form.video,
      prompt: form.prompt,
      creator: form.userId,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "videos"), newPost);
    return { id: docRef.id, ...newPost };
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = [];
    const querySnapshot = await getDocs(collection(db, "videos"));
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = [];
    const q = query(collection(db, "videos"), where("creator", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}

// Get video posts that match search query
export async function searchPosts(searchQuery) {
  try {
    const posts = [];
    const q = query(
      collection(db, "videos"),
      where("title", "==", searchQuery)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = [];
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc"),
      limit(7)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    throw new Error(error.message); // Return error message
  }
}
