import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BakeryApp from './pages/App';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import FormProduct from './pages/FormProduct';
import OrdersManager from './pages/OrdersManager';
import ConfirmOrder from './pages/ConfirmOrder';
import CustomersManager from './pages/CustomersManager';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Rota Principal */}
          <Route path="/" element={<BakeryApp />} />
          
          {/* Autenticação e Perfil */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          
          {/* Funcionalidades do Usuário */}
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/admin/customers" element={<CustomersManager />} />
          
          {/* Administração/Produtos */}
          <Route path="/form-produto" element={<FormProduct />} />
          <Route path="/admin/orders" element={<OrdersManager />} />
          <Route path="/confirmar-pedido/:orderId" element={<ConfirmOrder />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}