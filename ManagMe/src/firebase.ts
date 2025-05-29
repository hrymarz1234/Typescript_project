import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "",
  authDomain: "manageme2-c8918.firebaseapp.com",
  projectId: "manageme2-c8918",
  storageBucket: "manageme2-c8918.firebasestorage.app",
  messagingSenderId: "956743048777",
  appId: "1:956743048777:web:d7ba7b5fd9e48ef446e998",
  measurementId: "G-WXMK8QLX5K"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);