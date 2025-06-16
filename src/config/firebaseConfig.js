import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK1MdtjrczBJZbwde8n4NtdYh1h7a7u_w",
  authDomain: "dtshop-50141.firebaseapp.com",
  projectId: "dtshop-50141",
  storageBucket: "dtshop-50141.firebasestorage.app",
  messagingSenderId: "25769242398",
  appId: "1:25769242398:web:3ddac9805b87f84280a30f",
  measurementId: "G-WJ0J6JQKZ7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
