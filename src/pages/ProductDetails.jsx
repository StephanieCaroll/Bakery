import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, Minus, ShoppingBag, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails({ item, onBack, showNotification }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, darkMode } = useAuth();

  const handleAddToCart = () => {
    addToCart(item, quantity);
    
    if (showNotification) {
      showNotification(`${quantity}x ${item.name} adicionado ao carrinho! 🧁`);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack(); 
    } else {
      navigate(-1); 
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <button 
        onClick={handleBack} 
        className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-10 transition-colors w-fit ${
          darkMode ? 'text-white/60 hover:text-white' : 'text-[#bc232d] hover:opacity-70'
        }`}
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        {/* Lado Esquerdo: Imagem */}
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
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Avaliação e Categoria */}
          <div className="flex items-center gap-3 mb-6">
             <div className={`flex items-center gap-2 border w-fit px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-colors ${
              darkMode ? 'bg-white/10 border-white/20' : 'bg-white/40 border-white/20'
            }`}>
              <Star size={18} className={darkMode ? 'fill-white text-white' : 'fill-[#bc232d] text-[#bc232d]'} />
              <span className={`font-black text-sm ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{item.rating || "5.0"}</span>
            </div>

            <div className={`flex items-center gap-2 border w-fit px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-colors ${
              darkMode ? 'bg-white/10 border-white/20' : 'bg-white/40 border-white/20'
            }`}>
              <Tag size={16} className={darkMode ? 'text-white' : 'text-[#bc232d]'} />
              <span className={`font-black text-xs uppercase tracking-widest ${
                darkMode ? 'text-white' : 'text-[#bc232d]'
              }`}>
                {item.category || "Artesanal"}
              </span>
            </div>
          </div>

          {/* Título */}
          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.85] mb-6 uppercase tracking-tighter transition-colors ${
            darkMode ? 'text-white' : 'text-[#bc232d]'
          }`}>
            {item.name}
          </h1>

          {/* Descrição */}
          <p className={`text-lg lg:text-xl font-medium mb-10 leading-relaxed max-w-lg transition-colors ${
            darkMode ? 'text-white/80' : 'text-[#bc232d] opacity-90'
          }`}>
            {item.description || "Delicioso bolo artesanal preparado com os melhores ingredientes para tornar o seu momento inesquecível."}
          </p>

          {/* Preço e Seletor */}
          <div className="flex flex-col sm:flex-row items-center lg:items-center gap-8 lg:gap-12 mb-10">
              <div className="flex flex-col items-center lg:items-start">
                <span className={`text-xs font-black uppercase tracking-widest transition-colors ${
                  darkMode ? 'text-white/40' : 'text-[#bc232d] opacity-60'
                }`}>
                  Preço Individual
                </span>
                <span className={`text-5xl lg:text-6xl font-black tracking-tighter transition-colors ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  R${item.price}
                </span>
              </div>

              {/* Seletor de Quantidade */}
              <div className={`flex items-center gap-6 p-2 rounded-full border shadow-inner transition-colors ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'
              }`}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className={`p-4 rounded-full shadow-lg active:scale-90 transition hover:brightness-110 ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <Minus size={24} strokeWidth={3} />
                </button>
                
                <span className={`font-black text-3xl w-12 text-center transition-colors ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  {quantity}
                </span>

                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className={`p-4 rounded-full shadow-lg active:scale-90 transition hover:brightness-110 ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
          </div>

          {/* Botão Adicionar */}
          <button 
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-4 w-full max-w-md py-6 rounded-[2.5rem] font-black text-xl lg:text-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-tighter ${
              darkMode 
              ? 'bg-white text-zinc-900 hover:bg-zinc-100' 
              : 'bg-[#bc232d] text-white hover:brightness-110'
            }`}
          >
            <ShoppingBag size={28} />
            Adicionar - R${(Number(item.price) * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}