import React from 'react';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f4a28c] p-8 flex flex-col items-center">
       <button onClick={() => navigate('/')} className="self-start flex items-center gap-2 text-[#bc232d] font-bold mb-8"><ArrowLeft /> Voltar</button>
       <div className="w-full max-w-4xl bg-white/30 p-10 rounded-[3rem] backdrop-blur-md border border-white/20">
          <h2 className="text-4xl font-black text-[#bc232d] mb-8 flex items-center gap-4"><ShoppingCart size={40} /> MEU CARRINHO</h2>
          <div className="text-[#bc232d] text-center py-20 font-bold opacity-60">Seu carrinho está vazio... por enquanto! 🍰</div>
       </div>
    </div>
  );
}