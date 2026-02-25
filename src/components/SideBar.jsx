import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Heart, ShoppingCart, Settings, UtensilsCrossed, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onLogoClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, darkMode } = useAuth();

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
    <aside className={`w-full lg:w-24 h-auto lg:h-full flex lg:flex-col items-center pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,1.5rem))] lg:py-12 justify-between order-2 lg:order-1 z-50 transition-colors duration-500 border-none outline-none ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      <div className="flex lg:flex-col items-center gap-6 lg:gap-14 w-full justify-around lg:justify-start">
        
        <div 
          className={`hidden lg:flex p-3 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-md ${
            darkMode ? 'bg-white text-zinc-950' : 'bg-white text-[#bc232d]'
          }`} 
          onClick={handleLogoAction}
        >
          <UtensilsCrossed size={32} />
        </div>

        {/* Navegação */}
        <nav className="flex lg:flex-col gap-8 lg:gap-12 w-full justify-around lg:items-center">
          <Home 
            className={`cursor-pointer transition-colors ${isActive('/') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
            size={28} 
            onClick={handleLogoAction} 
          />
          <User 
            className={`cursor-pointer transition-colors ${isActive('/perfil') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
            size={28} 
            onClick={() => navigate('/perfil')} 
          />
          <Heart 
            className={`cursor-pointer transition-colors ${isActive('/favoritos') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
            size={28} 
            onClick={() => navigate('/favoritos')} 
          />
          <ShoppingCart 
            className={`cursor-pointer transition-colors ${isActive('/carrinho') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
            size={28} 
            onClick={() => navigate('/carrinho')} 
          />
          <Settings 
            className={`cursor-pointer transition-colors ${isActive('/configuracoes') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
            size={28} 
            onClick={() => navigate('/configuracoes')} 
          />
        </nav>
      </div>

      {user && (
        <LogOut 
          className="text-white/30 cursor-pointer hover:text-white hidden lg:block transition-colors" 
          size={28} 
          onClick={handleLogout} 
        />
      )}
    </aside>
  );
}