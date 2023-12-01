import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../static/firebase';

const AuthContext = React.createContext();
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          console.log('user signed in!', user);
          await initializeUser(user.uid);
        } else {
          console.log('user signed out!');
        }

        setCurrentUser(user);
        setLoading(false);
      },
      (err) => {
        console.log('An error occurred!', err);
      }
    );

    return unsubscribe;
  }, []);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  async function initializeUser(uid) {
    const data = { userID: uid };
    let res;

    try {
      res = await fetch(SERVER_URL + '/user/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } catch (e) {
      console.log("Error while initializing user", e)
    }

    if (!res.ok) {
      console.log("An error occured while initializing user", res.status, await res.json())
      return;
    }

    res = await res.json()

    console.log(res)
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
