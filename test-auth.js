import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "gen-lang-client-0705501801",
  "appId": "1:412062510701:web:946506145efef1d7839964",
  "apiKey": "AIzaSyDAOmpK7tHAH_kaJftDM1LGIltuq2cBZyA",
  "authDomain": "gen-lang-client-0705501801.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-9078491e-136e-48af-8656-12ccccee3a49",
  "storageBucket": "gen-lang-client-0705501801.firebasestorage.app",
  "messagingSenderId": "412062510701",
  "measurementId": ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testAuth() {
  try {
    console.log('Testing Firebase Auth and Firestore...');

    // Create a test user
    const email = 'test' + Date.now() + '@example.com';
    const userCredential = await createUserWithEmailAndPassword(auth, email, 'password123');
    console.log('Auth creation successful:', userCredential.user.email);
    console.log('User ID:', userCredential.user.uid);

    // Try to create a Firestore document
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      name: 'Test User',
      username: 'testuser',
      email: email.toLowerCase(),
      phone: '',
      uid: userCredential.user.uid,
      registeredAt: new Date().toISOString()
    });
    console.log('Firestore document created successfully');

    // Try to read the document
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log('Firestore document read successful:', docSnap.data());
    } else {
      console.log('Document does not exist');
    }

    // Sign out
    await signOut(auth);
    console.log('Signed out successfully');

  } catch (error) {
    console.error('Test failed:', error.code, error.message);
  }
}

testAuth();