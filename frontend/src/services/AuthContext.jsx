import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  database,
  dbRef,
  set,
} from './firebaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, profileData = {}) => {
    const {
      displayName,
      fullName,
      phone,
      gender,
      dob,
      location,
      photoUrl,
      useAvatar,
    } = profileData;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await set(dbRef(database, `users/${uid}/profile`), {
      email,
      displayName: displayName || fullName || email,
      fullName: fullName || displayName || email,
      phone: phone || '',
      gender: gender || '',
      dob: dob || '',
      location: location || '',
      photoUrl: useAvatar ? '' : photoUrl || '',
      avatarPreference: useAvatar ? 'avatar' : 'photo',
      createdAt: Date.now(),
    });

    return cred.user;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

