import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { store } from '@odyssage/frontend/app/store';
import { initializeApp } from 'firebase/app';
import { setUser } from '../model/authSlice';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export const signInAnonymous = async () => {
  const ret = await signInAnonymously(auth);
  console.log('signInAnonymous', ret);
  return ret;
};
onAuthStateChanged(auth, (user) => {
  if (!user) {
    store.dispatch(setUser({ uid: null, displayName: null }));
    return;
  }
  store.dispatch(setUser({ uid: user.uid, displayName: user.displayName }));
});
