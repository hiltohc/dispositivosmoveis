
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDa5DldqRm-uFlZmTEaFI0ojYEHt_BaLdg",
  authDomain: "projscs-2024.firebaseapp.com",
  projectId: "projscs-2024",
  storageBucket: "projscs-2024.firebasestorage.app",
  messagingSenderId: "209077765839",
  appId: "1:209077765839:web:b82e719a6f2f42d12199ba"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})



export { db, auth };