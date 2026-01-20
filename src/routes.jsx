// src/routes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import BakeryApp from './App';
import FormProduct from './FormProduct';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import CartPage from './CartPage';
import FavoritesPage from './FavoritesPage';
import SettingsPage from './SettingsPage';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BakeryApp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/form-produto" element={<FormProduct />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}