import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function ProductDetails({ item, onBack }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Botão de Voltar */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#bc232d] font-bold mb-8 hover:opacity-70 transition group w-fit"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
        Voltar para o menu
      </button>

      <div className="flex flex-1 items-center gap-16 px-4">
        {/* Lado Esquerdo: Imagem */}
        <div className="w-1/2 flex justify-center">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-[750px] h-[450px] object-cover transition-transform hover:scale-105 duration-700"
          />
        </div>

        {/* Lado Direito: Informações */}
        <div className="w-1/2">
          <div className="flex items-center gap-2 bg-[#bc232d] w-fit px-4 py-1 rounded-full mb-6">
            <Star size={18} className="fill-white text-white" />
            <span className="font-bold text-sm text-white">{item.rating}</span>
          </div>

          <h1 className="text-6xl font-black text-[#bc232d] leading-[0.9] mb-6 uppercase tracking-tighter">
            {item.name}
          </h1>

          <p className="text-[#bc232d] text-lg font-medium opacity-90 mb-10 leading-relaxed max-w-lg">
            {item.description}
          </p>

          <div className="flex items-center gap-12 mb-10">
             <div className="flex flex-col">
                <span className="text-[#bc232d] text-xs font-black uppercase opacity-60">Preço</span>
                <span className="text-5xl font-black text-[#bc232d]">R${item.price}</span>
             </div>

             {/* Seletor de Quantidade */}
             <div className="flex items-center gap-6 bg-white/40 p-2 rounded-full border border-white/20">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-[#bc232d] p-3 rounded-full text-white shadow-lg active:scale-90 transition"
                >
                  <Minus size={20} />
                </button>
                <span className="text-[#bc232d] font-black text-2xl w-10 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="bg-[#bc232d] p-3 rounded-full text-white shadow-lg active:scale-90 transition"
                >
                  <Plus size={20} />
                </button>
             </div>
          </div>

          <button className="flex items-center justify-center gap-4 bg-[#bc232d] w-full max-w-md py-6 rounded-[2rem] font-black text-white text-xl shadow-2xl hover:brightness-110 transition-all active:scale-95">
            <ShoppingBag size={26} />
            ADICIONAR AO CARRINHO - R${Number(item.price) * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}