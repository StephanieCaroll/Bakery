import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANN2Vi3vUPAiCIXoVaTHUmY-p_WQtacrQ",
  authDomain: "bakery-e5779.firebaseapp.com",
  projectId: "bakery-e5779",
  storageBucket: "bakery-e5779.firebasestorage.app",
  messagingSenderId: "503980932740",
  appId: "1:503980932740:web:80ed2b466ff15feb2d8cd1",
  measurementId: "G-EB6KMS98QC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);