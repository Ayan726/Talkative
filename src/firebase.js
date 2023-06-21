// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFQ9FaWWWDd0oGk_S3wTwlDBK25UJcfM8",
  authDomain: "chat-adf5a.firebaseapp.com",
  projectId: "chat-adf5a",
  storageBucket: "chat-adf5a.appspot.com",
  messagingSenderId: "807282211871",
  appId: "1:807282211871:web:1a2aaf3748b244c886292a",
  measurementId: "G-4VV4ZJT484"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const analytics = getAnalytics(app);
export const storage = getStorage();
export const db = getFirestore();