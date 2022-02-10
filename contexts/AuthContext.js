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
      (user) => {
        if (user) {
          console.log('user signed in!', user);
          initializeUser(user.uid);
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

  function initializeUser(uid) {
    const data = { userID: uid };

    fetch(SERVER_URL + '/user/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
