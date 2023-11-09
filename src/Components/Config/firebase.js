import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqc8c57qGKpuXsSIi39P4hWh3SmYb40W4",
  authDomain: "ticketing-system-7239e.firebaseapp.com",
  projectId: "ticketing-system-7239e",
  storageBucket: "ticketing-system-7239e.appspot.com",
  messagingSenderId: "253674509743",
  appId: "1:253674509743:web:becd7a45a76503a1c20b5a",
  measurementId: "G-5J7T46HB0K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Define the storage object

export { db, storage };
