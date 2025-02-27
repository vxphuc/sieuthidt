import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyDE29H2f2Eo3FqPCi2QD_7kOZz0ab7JUt4",
    authDomain: "dtweb-7cfee.firebaseapp.com",
    projectId: "dtweb-7cfee",
    storageBucket: "dtweb-7cfee.firebasestorage.app",
    messagingSenderId: "558236469233",
    appId: "1:558236469233:web:69fd6f464334d19e0fe650",
    measurementId: "G-MWEDEZG6X8"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
