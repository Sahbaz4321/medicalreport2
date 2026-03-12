import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getDatabase,
  ref as dbRef,
  set,
  push,
  onValue,
  update,
  remove,
  get,
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

// Your Firebase web app config (from Firebase console)
const firebaseConfig = {
  apiKey: 'AIzaSyBNCgkRp9ijbC501PaYAErok-Rj5CBziWw',
  authDomain: 'medicalreportanalyzer-248fd.firebaseapp.com',
  databaseURL: 'https://medicalreportanalyzer-248fd-default-rtdb.firebaseio.com',
  projectId: 'medicalreportanalyzer-248fd',
  // Important: use the bucket ID (appspot.com), not the HTTPS domain
  storageBucket: 'medicalreportanalyzer-248fd.appspot.com',
  messagingSenderId: '486243031459',
  appId: '1:486243031459:web:365a18a42999053b74a216',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export {
  app,
  auth,
  database,
  storage,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  dbRef,
  set,
  push,
  onValue,
  update,
  remove,
  get,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
};

