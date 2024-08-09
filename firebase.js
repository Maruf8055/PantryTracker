// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0mHxGKCw_lYhQh8E3bqR2wdGkdCqUoBM",
  authDomain: "inventory-management-app-47d49.firebaseapp.com",
  projectId: "inventory-management-app-47d49",
  storageBucket: "inventory-management-app-47d49.appspot.com",
  messagingSenderId: "202263760655",
  appId: "1:202263760655:web:1b33f630039941748fb87a",
  measurementId: "G-1J6HKJ0ZVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
