
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Keep your existing Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyDvpIQhG24Gr-b-FnzOoy6xEX-SRexRT5g",
  authDomain: "daily-task-manager-e4499.firebaseapp.com",
  projectId: "daily-task-manager-e4499",
  storageBucket: "daily-task-manager-e4499.firebasestorage.app",
  messagingSenderId: "532182829360",
  appId: "1:532182829360:web:b1c1f40f614b129d3b20f5"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;


