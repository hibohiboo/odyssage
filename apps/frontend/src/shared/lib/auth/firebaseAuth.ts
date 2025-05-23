import {
  connectAuthEmulator,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  NextOrObserver,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  validatePassword,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

if (import.meta.env.DEV || import.meta.env.VITE_CI === 'true') {
  console.log('connectAuthEmulator');
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

export const getCurrentUser = () => auth.currentUser;

// BDDのテストで、signInAnonymousを実行する前にonAuthStateChangedが呼ばれることがあるため、
// その場合はsignInAnonymousを実行しないようにするためのフラグを追加
let authInitialized = false;
export const signInAnonymous = async () => {
  // 既に初期化されている場合は処理をスキップ
  if (authInitialized) {
    console.log('authInitialized', authInitialized);
    return;
  }

  authInitialized = true;
  const ret = await signInAnonymously(auth);
  console.log('signInAnonymous', ret);
};
export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);
export const getIdToken = async () => {
  // CI環境でのテスト実行時に、別ユーザとして認識されるとテストが失敗するためユーザを固定
  if (import.meta.env.VITE_CI === 'true') {
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) return savedToken;
  }
  const user = auth.currentUser;
  if (user == null) {
    return null;
  }
  return user.getIdToken();
};

export const credentialUserWithMail = async (
  email: string,
  password: string,
) => {
  // エミュレーターの場合はvalidatePasswordのメソッドがないためパスワードのバリデーションをスキップ
  const status = import.meta.env.DEV
    ? { isValid: true }
    : await validatePassword(auth, password);
  if (!status.isValid) {
    throw new Error(`Invalid password`);
  }
  if (auth.currentUser == null) {
    throw new Error(`User is not signed in`);
  }
  const credential = EmailAuthProvider.credential(email, password);
  const userCredential = await linkWithCredential(auth.currentUser, credential);

  const { user } = userCredential;
  console.log('signInMail', user);
};
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const { user } = userCredential;
  return user;
};
export const changeUserName = async (name: string) => {
  if (auth.currentUser == null) {
    throw new Error(`User is not signed in`);
  }
  await updateProfile(auth.currentUser, {
    displayName: name,
  });
};
