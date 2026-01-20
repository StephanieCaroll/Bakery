import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, Minus, ShoppingBag, Tag } from 'lucide-react';

export default function ProductDetails({ item, onBack }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        {/* Lado Esquerdo: Imagem Responsiva */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative group w-full max-w-lg lg:max-w-2xl">
            <img 
              src={item.image} 
              alt={item.name} 
              className="relative w-full transition-transform hover:scale-105 duration-700 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Lado Direito: Informações */}
        <div className="w-full lg:w-1/2">
          
          {/* Badges: Avaliação e Categoria */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-[#bc232d] w-fit px-4 py-2 rounded-full shadow-lg">
              <Star size={18} className="fill-white text-white" />
              <span className="font-black text-sm text-white">{item.rating || "5.0"}</span>
            </div>

            {/* Badge de Categoria */}
            <div className="flex items-center gap-2 bg-white/40 border border-white/20 w-fit px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">
              <Tag size={16} className="text-[#bc232d]" />
              <span className="font-black text-xs text-[#bc232d] uppercase tracking-widest">
                {item.category || "Artesanal"}
              </span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-[#bc232d] leading-[0.85] mb-6 uppercase tracking-tighter">
            {item.name}
          </h1>

          <p className="text-[#bc232d] text-lg lg:text-xl font-medium opacity-90 mb-10 leading-relaxed max-w-lg">
            {item.description || "Delicioso bolo artesanal preparado com os melhores ingredientes para tornar o seu momento inesquecível."}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:gap-12 mb-10">
              <div className="flex flex-col">
                <span className="text-[#bc232d] text-xs font-black uppercase opacity-60 tracking-widest">Preço Individual</span>
                <span className="text-5xl lg:text-6xl font-black text-[#bc232d] tracking-tighter">R${item.price}</span>
              </div>

              {/* Seletor de Quantidade */}
              <div className="flex items-center gap-6 bg-white/40 p-2 rounded-full border border-white/20 shadow-inner">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-[#bc232d] p-4 rounded-full text-white shadow-lg active:scale-90 transition hover:brightness-110"
                >
                  <Minus size={24} strokeWidth={3} />
                </button>
                <span className="text-[#bc232d] font-black text-3xl w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="bg-[#bc232d] p-4 rounded-full text-white shadow-lg active:scale-90 transition hover:brightness-110"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
          </div>

          <button className="flex items-center justify-center gap-4 bg-[#bc232d] w-full max-w-md py-6 rounded-[2.5rem] font-black text-white text-xl lg:text-2xl shadow-2xl hover:brightness-110 transition-all active:scale-95 uppercase tracking-tighter">
            <ShoppingBag size={28} />
            Adicionar - R${(Number(item.price) * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}