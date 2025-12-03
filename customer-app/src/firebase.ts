// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqmGRy7hWkJJkc_OVGjMDhUuaew_y0J_8",
  authDomain: "customer-app-demo-70be6.firebaseapp.com",
  projectId: "customer-app-demo-70be6",
  storageBucket: "customer-app-demo-70be6.firebasestorage.app",
  messagingSenderId: "906713907754",
  appId: "1:906713907754:web:c481de48dcb8fced9fb953"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
