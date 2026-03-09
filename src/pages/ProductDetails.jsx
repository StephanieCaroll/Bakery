import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, Minus, ShoppingBag, Tag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails({ item, onBack, showNotification }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, darkMode, isAdmin } = useAuth(); 
  const isOutOfStock = item.stock <= 0;

  const handleAddToCart = () => {
    // BLOQUEIO PARA ADMINISTRADOR
    if (isAdmin) {
      if (showNotification) {
        showNotification("Você é o administrador, ação desnecessária. 🛡️");
      } else {
        alert("Você é o administrador, ação desnecessária. 🛡️");
      }
      return;
    }

    if (quantity > item.stock) {
      if (showNotification) {
        showNotification(`Apenas ${item.stock} unidades disponíveis! ⚠️`);
      }
      return;
    }
    
    addToCart(item, quantity);
    
    if (showNotification) {
      showNotification(`${quantity}x ${item.name} adicionado ao carrinho! 🧁`);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <button 
        onClick={onBack} 
        className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-10 transition-colors w-fit ${
          darkMode ? 'text-white/60 hover:text-white' : 'text-[#bc232d] hover:opacity-70'
        }`}
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative group w-full max-w-lg lg:max-w-2xl">
            <img 
              src={item.image} 
              alt={item.name} 
              className={`relative w-full transition-transform duration-700 object-contain drop-shadow-2xl 
              ${isOutOfStock ? 'grayscale opacity-50' : 'hover:scale-105'}`}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
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

          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.85] mb-6 uppercase tracking-tighter transition-colors ${
            darkMode ? 'text-white' : 'text-[#bc232d]'
          }`}>
            {item.name} {isOutOfStock && <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full align-middle ml-4">ESGOTADO</span>}
          </h1>

          <p className={`text-lg lg:text-xl font-medium mb-10 leading-relaxed max-w-lg transition-colors ${
            darkMode ? 'text-white/80' : 'text-[#bc232d] opacity-90'
          }`}>
            {item.description || "Delicioso bolo artesanal preparado com os melhores ingredientes."}
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-center gap-8 lg:gap-12 mb-10">
              <div className="flex flex-col items-center lg:items-start">
                <span className={`text-xs font-black uppercase tracking-widest transition-colors ${
                  darkMode ? 'text-white/40' : 'text-[#bc232d] opacity-60'
                }`}>
                  Preço Individual (Stock: {item.stock || 0})
                </span>
                <span className={`text-5xl lg:text-6xl font-black tracking-tighter transition-colors ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  R${item.price}
                </span>
              </div>

              <div className={`flex items-center gap-6 p-2 rounded-full border shadow-inner transition-colors ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'
              }`}>
                <button 
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className={`p-4 rounded-full shadow-lg active:scale-90 transition hover:brightness-110 disabled:opacity-30 ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <Minus size={24} strokeWidth={3} />
                </button>
                
                <span className={`font-black text-3xl w-12 text-center transition-colors ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  {isOutOfStock ? 0 : quantity}
                </span>

                <button 
                  disabled={isOutOfStock || quantity >= item.stock}
                  onClick={() => setQuantity(q => q + 1)}
                  className={`p-4 rounded-full shadow-lg active:scale-90 transition hover:brightness-110 disabled:opacity-30 ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
          </div>

          <button 
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-4 w-full max-w-md py-6 rounded-[2.5rem] font-black text-xl lg:text-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-tighter 
            ${isOutOfStock ? 'bg-zinc-500 text-white cursor-not-allowed' : (darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white')}
            ${isAdmin && !isOutOfStock ? 'opacity-50' : ''}`}
          >
            <ShoppingBag size={28} />
            {isOutOfStock ? 'Produto Esgotado' : isAdmin ? 'Ação Desnecessária' : `Adicionar - R$${(Number(item.price) * quantity).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}