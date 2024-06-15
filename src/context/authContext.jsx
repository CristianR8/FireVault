import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {

    const info = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((usuarioFirebase) => {
      return usuarioFirebase;
    });

    const docuref = await doc(firestore, `usuarios/${info.user.uid}`);
    setDoc(docuref, { email: email, rol: "user2" });

    return info;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
  
      async function getRol(uid) {
        const docuRef = doc(firestore, `usuarios/${uid}`);
        const docuCifrada = await getDoc(docuRef);

        if (docuCifrada.exists()) {
          const infoFinal = docuCifrada.data().rol;
          currentUser.role = infoFinal;
        } else {
          console.log("No such document!");
        }

        setUser(currentUser);
        setLoading(false);
      }

      console.log(currentUser);
      setUser(currentUser);
      setLoading(true);
      getRol(currentUser?.uid);
  
    });

    return () => unsubuscribe();
  
  }, []);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        resetPassword,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
