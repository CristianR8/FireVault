// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes} from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQoeTMGpHBKcpZamk2gZTBp0tJ_kwpAak",
  authDomain: "biomedical-unab.firebaseapp.com",
  projectId: "biomedical-unab",
  storageBucket: "biomedical-unab.appspot.com",
  messagingSenderId: "651574553493",
  appId: "1:651574553493:web:33ffbee44cbb55ca19a49c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
