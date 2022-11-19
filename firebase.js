// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1A1Mv7tymns-w8d-mXWhQjUQSIVOoWjU",
  authDomain: "whatsapp-v2-6d219.firebaseapp.com",
  projectId: "whatsapp-v2-6d219",
  storageBucket: "whatsapp-v2-6d219.appspot.com",
  messagingSenderId: "704775662184",
  appId: "1:704775662184:web:7e30ef822fbc36958ea9dd"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export {app, db, auth, provider};