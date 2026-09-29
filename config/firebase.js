// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7FmZa6yCNqJX0iiw7aqg6K2ijtQ095CA",
  authDomain: "bancodedados-zefir.firebaseapp.com",
  projectId: "bancodedados-zefir",
  storageBucket: "bancodedados-zefir.firebasestorage.app",
  messagingSenderId: "285607408288",
  appId: "1:285607408288:web:0c9693b612dd937aec0fc5",
  measurementId: "G-26S8C73970"
}
 
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)