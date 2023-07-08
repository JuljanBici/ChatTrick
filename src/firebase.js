import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCLpl7V9FfjMB7V7t8xy4c6rU155XsQQoI",
  authDomain: "chat-app-8e287.firebaseapp.com",
  projectId: "chat-app-8e287",
  storageBucket: "chat-app-8e287.appspot.com",
  messagingSenderId: "706880043993",
  appId: "1:706880043993:web:9981718979a6728e6df7c8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore()