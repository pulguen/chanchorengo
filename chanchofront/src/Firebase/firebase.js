// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// Importa initializeFirestore y persistentLocalCache en lugar de getFirestore
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQ5zGzsx1K6dRnycZwDc4qc8PWZPI8syQ",
  authDomain: "elchanchorengoweb.firebaseapp.com",
  projectId: "elchanchorengoweb",
  storageBucket: "elchanchorengoweb.appspot.com",
  messagingSenderId: "323108586614",
  appId: "1:323108586614:web:936a464898176a38900b57",
  measurementId: "G-G3HTT0CZLL",
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const analytics = getAnalytics(app); // (opcional)
export const auth = getAuth(app); // Autenticación
export const storage = getStorage(app); // Almacenamiento

// Inicializar Firestore con persistencia offline sin enableIndexedDbPersistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    // Opcional: fuerza la pestaña actual a ser la propietaria de la caché
    experimentalForceOwningTab: true,
  }),
});
