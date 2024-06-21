// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-354c6.firebaseapp.com",
  projectId: "mern-estate-354c6",
  storageBucket: "mern-estate-354c6.appspot.com",
  messagingSenderId: "833479784113",
  appId: "1:833479784113:web:9a55cdeb43c448c11e9490",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
