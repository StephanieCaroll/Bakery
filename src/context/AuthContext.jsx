import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.replace(/['"]+/g, '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
     
      const checkAdmin = currentUser?.email === ADMIN_EMAIL;
      setIsAdmin(checkAdmin);
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product, quantity) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now(), quantity }]);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, logout, darkMode, setDarkMode, cart, setCart, addToCart }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);