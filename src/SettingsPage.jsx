// src/SettingsPage.jsx
import React, { useState } from 'react';
import { ArrowLeft, Bell, Shield, Moon, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f4a28c] p-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#bc232d] font-bold mb-8"><ArrowLeft /> Voltar</button>
      <div className="max-w-xl mx-auto bg-white/30 p-10 rounded-[3rem] backdrop-blur-md border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-black text-[#bc232d] mb-10 text-center uppercase tracking-tighter">Configurações</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl text-[#bc232d]">
            <div className="flex items-center gap-4"><Bell /> <span>Notificações de Promoções</span></div>
            <input type="checkbox" defaultChecked className="accent-[#bc232d] w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl text-[#bc232d]">
            <div className="flex items-center gap-4"><Moon /> <span>Modo Escuro</span></div>
            <input type="checkbox" className="accent-[#bc232d] w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl text-[#bc232d]">
             <div className="flex items-center gap-4"><Shield /> <span>Privacidade</span></div>
             <span className="text-xs font-bold bg-[#bc232d] text-white px-2 py-1 rounded">ATIVO</span>
          </div>
        </div>
      </div>
    </div>
  );
}