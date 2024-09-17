import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyACnHsc6Zmf8UipebhuAQSIr29wkivUdUQ",
  authDomain: "madarasamanagment.firebaseapp.com",
  projectId: "madarasamanagment",
  storageBucket: "madarasamanagment.appspot.com",
  messagingSenderId: "742440614322",
  appId: "1:742440614322:web:dafad7335dbcb6feca0cab",
  measurementId: "G-54DYBCXZLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export both db and auth
export { db, auth };
