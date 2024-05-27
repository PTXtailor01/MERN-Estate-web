// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-da64b.firebaseapp.com",
  projectId: "mern-estate-da64b",
  storageBucket: "mern-estate-da64b.appspot.com",
  messagingSenderId: "39629288844",
  appId: "1:39629288844:web:1185b1155b9e6db38d92a9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);