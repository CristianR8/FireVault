// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOONYeldZMtNYaO5_HFSgxSZVvXA9x0M0",
  authDomain: "firevault-b2f13.firebaseapp.com",
  projectId: "firevault-b2f13",
  storageBucket: "firevault-b2f13.appspot.com",
  messagingSenderId: "126662118338",
  appId: "1:126662118338:web:d05f01945df4791197a45b",
  measurementId: "G-LBVGMYM2RS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, firestore, storage };