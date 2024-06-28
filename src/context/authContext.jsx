import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
    const info = await createUserWithEmailAndPassword(auth, email, password);
    const docRef = doc(firestore, `usuarios/${info.user.uid}`);
    await setDoc(docRef, { email: email, rol: "user2" });
    return info;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const getRol = async (uid) => {
          try {
            const docRef = doc(firestore, `usuarios/${uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const infoFinal = docSnap.data().rol;
              currentUser.role = infoFinal;
            } else {
              console.log("No such document!");
            }
            setUser(currentUser);
          } catch (error) {
            console.error("Error getting document:", error);
          } finally {
            setLoading(false);
          }
        };
        getRol(currentUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
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
