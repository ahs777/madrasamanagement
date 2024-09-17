import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtVcueyEcApRjvLK44cO31SXe8pk6Ympo",
  authDomain: "bookstoreaccountsmanagment.firebaseapp.com",
  projectId: "bookstoreaccountsmanagment",
  storageBucket: "bookstoreaccountsmanagment.appspot.com",
  messagingSenderId: "108421982751",
  appId: "1:108421982751:web:97df9fcd6efbfd2f82032a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export both db and auth
export { db, auth };
