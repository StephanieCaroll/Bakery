import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, Home, User, Heart, Settings, UtensilsCrossed, LogOut 
} from 'lucide-react';
import { useAuth } from './AuthContext'; //

export default function CartPage() {
  const navigate = useNavigate(); //
  const { user, logout } = useAuth(); //

  const handleLogout = async () => {
    await logout(); //
    navigate('/login'); //
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#bc232d] font-sans overflow-hidden">
      
      {/* SIDEBAR / MENU INFERIOR */}
      <aside className="w-full lg:w-24 h-auto lg:h-full bg-[#bc232d] flex lg:flex-col items-center pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,1.5rem))] lg:py-12 justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10 px-6 lg:px-0 z-50">
        <div className="flex lg:flex-col items-center gap-6 lg:gap-14 w-full justify-around lg:justify-start">
          <div className="hidden lg:flex bg-white p-3 rounded-full text-[#bc232d] shadow-lg cursor-pointer" onClick={() => navigate('/')}>
            <UtensilsCrossed size={32} />
          </div>
          <nav className="flex lg:flex-col gap-8 lg:gap-12 text-white/50 w-full justify-around lg:items-center">
            <Home className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/')} />
            <User className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/perfil')} />
            <Heart className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/favoritos')} />
            <ShoppingCart className="text-white" size={28} />
            <Settings className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/configuracoes')} />
          </nav>
        </div>
        {/* ÍCONE DE LOGOUT RESTAURADO */}
        {user && <LogOut className="text-white/50 cursor-pointer hover:text-white hidden lg:block" size={28} onClick={handleLogout} />}
      </aside>

      <main className="flex-1 bg-[#f4a28c] lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 no-scrollbar">
         <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#bc232d] font-black uppercase tracking-widest text-sm mb-10"><ArrowLeft /> Voltar</button>
         <div className="w-full max-w-4xl mx-auto bg-white/30 p-10 rounded-[3rem] backdrop-blur-md border border-white/20">
            <h2 className="text-4xl font-black text-[#bc232d] mb-8 flex items-center gap-4 uppercase tracking-tighter"><ShoppingCart size={40} /> MEU CARRINHO</h2>
            <div className="text-[#bc232d] text-center py-20 font-black opacity-60 uppercase italic">Seu carrinho está vazio... por enquanto! 🍰</div>
         </div>
      </main>
    </div>
  );
}