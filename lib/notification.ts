// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu6-abxtiIFZYMXNj7t_dB_DoTBXzrcis",
  authDomain: "lms-project-bceca.firebaseapp.com",
  projectId: "lms-project-bceca",
  storageBucket: "lms-project-bceca.appspot.com",
  messagingSenderId: "838070407800",
  appId: "1:838070407800:web:0de039d6b72bef8bd0138d",
  measurementId: "G-HPEJ5BR1RM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
