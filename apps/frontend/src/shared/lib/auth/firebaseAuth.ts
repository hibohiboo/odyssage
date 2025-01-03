import {
  getAuth,
  NextOrObserver,
  onAuthStateChanged,
  signInAnonymously,
  User,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
};
console.log('firebaseConfig', firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export const signInAnonymous = async () => {
  const ret = await signInAnonymously(auth);
  console.log('signInAnonymous', ret);
  return ret;
};
export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);
