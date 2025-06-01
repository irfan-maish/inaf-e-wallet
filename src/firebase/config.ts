import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3FNubPF7pWBI5HYgIso8fj8Nymo4RTHM",
  authDomain: "easy-chat-irfan.firebaseapp.com",
  databaseURL: "https://easy-chat-irfan-default-rtdb.firebaseio.com",
  projectId: "easy-chat-irfan",
  storageBucket: "easy-chat-irfan.applestorage.app",
  messagingSenderId: "521157879920",
  appId: "1:521157879920:web:932e351a137229cee2acb5",
  measurementId: "G-FTRB7W2KYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;