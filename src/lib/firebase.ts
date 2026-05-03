import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

console.log('Firebase Config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized successfully');

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
console.log('Firestore initialized');

export const auth = getAuth(app);
console.log('Auth initialized:', auth);

export const storage = getStorage(app);
console.log('Storage initialized');

export const googleProvider = new GoogleAuthProvider();
console.log('Google provider initialized');
