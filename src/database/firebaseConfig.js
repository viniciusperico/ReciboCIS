import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDwP_I0GHH1nJLnpVNPk-Dd27cmSifZ8JQ",
  authDomain: "recibocis.firebaseapp.com",
  databaseURL: "https://recibocis-default-rtdb.firebaseio.com",  
  projectId: "recibocis",
  storageBucket: "recibocis.firebasestorage.app",
  messagingSenderId: "358833164194",
  appId: "1:358833164194:web:082a19debb7bded7e22cfb",
  measurementId: "G-DHGGREWYXW"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db };
