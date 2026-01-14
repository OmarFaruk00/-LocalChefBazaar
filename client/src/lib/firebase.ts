import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let auth;

try {
  // Check if all required Firebase config values are present
  const hasConfig = firebaseConfig.apiKey && 
                   firebaseConfig.authDomain && 
                   firebaseConfig.projectId;
  
  if (hasConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.warn('Firebase configuration is missing. Please set up your .env file with Firebase credentials.');
    // Create a mock auth object to prevent crashes
    auth = null as any;
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  auth = null as any;
}

export { auth };
export default app;

