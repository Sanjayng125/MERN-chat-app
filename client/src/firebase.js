// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API,
  authDomain: "mern-chat-app-1c60e.firebaseapp.com",
  projectId: "mern-chat-app-1c60e",
  storageBucket: "mern-chat-app-1c60e.appspot.com",
  messagingSenderId: "421522303087",
  appId: "1:421522303087:web:9f7fcc8db220972935459a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
