// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "API KEY",
  authDomain: "peopletracker-a77f4.firebaseapp.com",
  projectId: "peopletracker-a77f4",
  storageBucket: "peopletracker-a77f4.appspot.com",
  messagingSenderId: "15553140346",
  appId: "1:15553140346:web:051bd51906d67b93354dc3",
  measurementId: "G-PECJ91E6Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}