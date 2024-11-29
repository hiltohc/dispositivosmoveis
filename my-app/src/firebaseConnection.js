
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: " ", // coloque os dados do projeto do firebase
  authDomain: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " "
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})



export { db, auth };
