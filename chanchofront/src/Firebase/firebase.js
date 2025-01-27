// Importar las funciones necesarias
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQ5zGzsx1K6dRnycZwDc4qc8PWZPI8syQ",
  authDomain: "elchanchorengoweb.firebaseapp.com",
  projectId: "elchanchorengoweb",
  storageBucket: "elchanchorengoweb.appspot.com",
  messagingSenderId: "323108586614",
  appId: "1:323108586614:web:936a464898176a38900b57",
  measurementId: "G-G3HTT0CZLL",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que planeas usar
export const analytics = getAnalytics(app); // Analytics (opcional)
export const auth = getAuth(app); // Autenticación
export const db = getFirestore(app); // Firestore
export const storage = getStorage(app); // Almacenamiento
