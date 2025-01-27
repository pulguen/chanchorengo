import { createContext, useEffect, useState } from "react";
import { auth } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateProfileFirebase, // Renombra para evitar conflictos de nombres
} from "firebase/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userLogin, setUserLogin] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setUserLogin(user);
      setAuthChecked(true);
    });
    return () => unSubscribe;
  }, []);

  // Registro
  const registerEmail = async (nombre, email, pass) => {
    const response = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfileFirebase(response.user, { displayName: nombre });
  };

  // Inicio de sesión
  const loginEmail = async (email, pass) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // Cerrar sesión
  const logOut = () => {
    signOut(auth);
  };

  // Actualizar perfil
  const updateUserProfile = async (nombre) => {
    if (userLogin) {
      await updateProfileFirebase(userLogin, { displayName: nombre });
      setUserLogin({ ...userLogin, displayName: nombre });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        authChecked,
        loginEmail,
        registerEmail,
        logOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}