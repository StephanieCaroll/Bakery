import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, User, Heart, ShoppingCart, Settings, 
  UtensilsCrossed, LogOut, PlusCircle, ClipboardList 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const scrollbarHideStyle = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function Sidebar({ onLogoClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout, darkMode } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleLogoAction = () => {
    if (onLogoClick) onLogoClick();
    navigate('/');
  };

  return (
    <aside className={`w-full lg:w-24 h-auto lg:h-full flex lg:flex-col items-center pt-4 pb-[calc(0.8rem+env(safe-area-inset-bottom,1.5rem))] lg:py-12 justify-between order-2 lg:order-1 z-[100] transition-colors duration-500 shadow-2xl ${
      darkMode 
        ? 'bg-zinc-950 shadow-black' 
        : 'bg-[#bc232d] shadow-[#bc232d]/40' 
    } border-r ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
      <style>{scrollbarHideStyle}</style>
      
      <div className="flex lg:flex-col items-center gap-6 lg:gap-14 w-full">
        
        <div 
          className={`hidden lg:flex p-3 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-md ${
            darkMode ? 'bg-white text-zinc-950' : 'bg-white text-[#bc232d]'
          }`} 
          onClick={handleLogoAction}
        >
          <UtensilsCrossed size={32} />
        </div>

        <nav className="flex lg:flex-col gap-8 lg:gap-10 w-full px-10 lg:px-0 justify-start lg:items-center overflow-x-auto lg:overflow-x-visible hide-scrollbar snap-x">
          
          <div className="flex lg:flex-col gap-8 lg:gap-10 mx-auto lg:mx-0 items-center">
            <Home 
              className={`cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={28} 
              onClick={handleLogoAction} 
            />
            
            <User 
              className={`cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/perfil') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={28} 
              onClick={() => navigate('/perfil')} 
            />
            
            {isAdmin && (
              <PlusCircle 
                className={`cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/form-produto') ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-400'}`} 
                size={28} 
                onClick={() => navigate('/form-produto')} 
              />
            )}

            {isAdmin && (
              <ClipboardList 
                className={`cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/admin/orders') ? 'text-blue-400' : 'text-white/30 hover:text-blue-400'}`} 
                size={28} 
                onClick={() => navigate('/admin/orders')} 
              />
            )}

            <Heart 
              className={`cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/favoritos') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={28} 
              onClick={() => navigate('/favoritos')} 
            />
            
            <ShoppingCart 
              className={`cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/carrinho') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={28} 
              onClick={() => navigate('/carrinho')} 
            />

            <Settings 
              className={`lg:hidden cursor-pointer min-w-[28px] transition-colors snap-center ${isActive('/configuracoes') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={28} 
              onClick={() => navigate('/configuracoes')} 
            />
          </div>
        </nav>
      </div>

      <div className="hidden lg:flex lg:flex-col items-center gap-10">
        <Settings 
          className={`cursor-pointer transition-colors ${isActive('/configuracoes') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
          size={28} 
          onClick={() => navigate('/configuracoes')} 
        />

        {user && (
          <LogOut 
            className="text-white/30 cursor-pointer hover:text-red-400 transition-colors" 
            size={28} 
            onClick={handleLogout} 
          />
        )}
      </div>
    </aside>
  );
}