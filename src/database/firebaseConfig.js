import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC60MXbbcSLZhIj33nGM53Yu9digDgCS3w",
  authDomain: "ortese-e-protese.firebaseapp.com",
  databaseURL: "https://ortese-e-protese-default-rtdb.firebaseio.com",
  projectId: "ortese-e-protese",
  storageBucket: "ortese-e-protese.firebasestorage.app",
  messagingSenderId: "707763081056",
  appId: "1:707763081056:web:d5d984210911bd36471805",
  measurementId: "G-H9F90PX0X2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
