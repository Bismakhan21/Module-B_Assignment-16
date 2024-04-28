// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-nOQIWnH8jmkbs3MYI4c0e0p1AQF9vuk",
  authDomain: "message-app-c72d0.firebaseapp.com",
  databaseURL: "https://message-app-c72d0-default-rtdb.firebaseio.com",
  projectId: "message-app-c72d0",
  storageBucket: "message-app-c72d0.appspot.com",
  messagingSenderId: "338832823062",
  appId: "1:338832823062:web:092931d25f5d7b0ac43637",
  measurementId: "G-QRV0PCLX85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app};