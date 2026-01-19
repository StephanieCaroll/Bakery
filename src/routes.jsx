import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BakeryApp from './App';
import FormProduct from './FormProduct';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BakeryApp />} />
        <Route path="/form-produto" element={<FormProduct />} />   {/* rota de testes */}
      </Routes>
    </BrowserRouter>
  );
}