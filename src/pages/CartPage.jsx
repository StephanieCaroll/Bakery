import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/SideBar'; 

const GlobalLoading = ({ darkMode }) => (
  <div className={`flex flex-col items-center justify-center h-[100dvh] w-full animate-in fade-in duration-500 ${
    darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'
  }`}>
    <div className="animate-spin mb-4">
      <UtensilsCrossed size={40} />
    </div>
    <p className="font-black uppercase tracking-widest text-xs">Carregando Carrinho...</p>
  </div>
);

const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function CartPage() {
  const navigate = useNavigate();
  const { user, logout, cart, setCart, darkMode } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const removeItem = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) return <GlobalLoading darkMode={darkMode} />;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      <style>{scrollbarHideStyle}</style>

      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 scrollbar-hide transition-colors duration-500 border-none outline-none ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
          <button 
            onClick={() => navigate('/')} 
            className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-10 transition-colors ${
              darkMode ? 'text-white/60 hover:text-white' : 'text-[#bc232d] hover:opacity-70'
            }`}
          >
            <ArrowLeft size={20} /> Voltar
          </button>
          
          <div className={`w-full max-w-4xl mx-auto p-10 rounded-[3rem] backdrop-blur-md border transition-colors ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/20'
          }`}>
            <h2 className="text-4xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
              <ShoppingCart size={40} /> MEU CARRINHO
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-20 font-black opacity-60 uppercase italic">
                Seu carrinho está vazio... por enquanto! 🍰
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.cartId} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-colors ${
                    darkMode ? 'bg-zinc-800/50 border-white/5' : 'bg-white/40 border-[#bc232d]/10'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-tighter text-lg">{item.name}</p>
                        <p className="text-xs font-bold opacity-60 uppercase">
                          {item.quantity} unidades • R${item.price} cada
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-black text-xl">R${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeItem(item.cartId)} 
                        className="text-red-500 hover:scale-125 transition-transform p-2 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-8 border-t border-white/10 flex flex-col items-end">
                   <p className="text-xs font-black uppercase opacity-60">Total do Pedido</p>
                   <p className="text-5xl font-black tracking-tighter">
                     R${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                   </p>
                   <button className={`mt-6 w-full lg:w-auto px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                     darkMode ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-[#bc232d] text-white hover:bg-[#a01d25]'
                   }`}>
                     Finalizar via WhatsApp
                   </button>
                </div>
              </div>
            )}
          </div>
      </main>
    </div>
  );
}