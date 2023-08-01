// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCLbb3R5-oe7aibP7pNo4t_m97QNfIcGWs',
  authDomain: 'react-firebase-chat-app-98f87.firebaseapp.com',
  projectId: 'react-firebase-chat-app-98f87',
  storageBucket: 'react-firebase-chat-app-98f87.appspot.com',
  messagingSenderId: '668086216351',
  appId: '1:668086216351:web:1e0a7fd00eacfa9198a4aa',
  measurementId: 'G-32FG584NM2',
  databaseURL:
    'https://react-firebase-chat-app-98f87-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDatabase = getDatabase(app);
// const analytics = getAnalytics(app);
