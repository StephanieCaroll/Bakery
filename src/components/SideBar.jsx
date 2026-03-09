import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, User, Heart, ShoppingCart, Settings, 
  UtensilsCrossed, LogOut, PlusCircle, ClipboardList, Users,
  LayoutTemplate 
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
    <aside className={`w-full lg:w-28 h-auto lg:h-full flex lg:flex-col items-center pt-4 pb-[calc(0.8rem+env(safe-area-inset-bottom,1.5rem))] lg:py-10 justify-between order-2 lg:order-1 z-[100] transition-all duration-500 shadow-2xl ${
      darkMode 
        ? 'bg-zinc-950 border-r border-white/5' 
        : 'bg-[#bc232d] border-r-4 border-[#bc232d]/20' 
    }`}>
      <style>{scrollbarHideStyle}</style>
      
      <div className="flex lg:flex-col items-center w-full lg:h-full">
        
        <div 
          className={`hidden lg:flex p-4 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-lg mb-10 ${
            darkMode ? 'bg-white text-zinc-950' : 'bg-white text-[#bc232d]'
          }`} 
          onClick={handleLogoAction}
        >
          <UtensilsCrossed size={32} />
        </div>

        <nav className="flex lg:flex-col w-full px-4 lg:px-0 justify-around lg:justify-center lg:flex-1 items-center overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible hide-scrollbar snap-x">
          <div className="flex lg:flex-col gap-8 lg:gap-9 items-center py-4">
            
            <Home 
              className={`cursor-pointer transition-colors snap-center ${isActive('/') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={30} 
              onClick={handleLogoAction} 
            />
            
            <User 
              className={`cursor-pointer transition-colors snap-center ${isActive('/perfil') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={30} 
              onClick={() => navigate('/perfil')} 
            />
            
            {isAdmin && (
              <>
                <PlusCircle 
                  className={`cursor-pointer transition-colors snap-center ${isActive('/form-produto') ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-400'}`} 
                  size={30} 
                  onClick={() => navigate('/form-produto')} 
                />
                <ClipboardList 
                  className={`cursor-pointer transition-colors snap-center ${isActive('/admin/orders') ? 'text-blue-400' : 'text-white/30 hover:text-blue-400'}`} 
                  size={30} 
                  onClick={() => navigate('/admin/orders')} 
                />
                <Users 
                  className={`cursor-pointer transition-colors snap-center ${isActive('/admin/customers') ? 'text-green-400' : 'text-white/30 hover:text-green-400'}`} 
                  size={30} 
                  onClick={() => navigate('/admin/customers')} 
                />
                <LayoutTemplate 
                  className={`cursor-pointer transition-colors snap-center ${isActive('/admin/banner') ? 'text-orange-400' : 'text-white/30 hover:text-orange-400'}`} 
                  size={30} 
                  onClick={() => navigate('/admin/banner')} 
                />
              </>
            )}

            <Heart 
              className={`cursor-pointer transition-colors snap-center ${isActive('/favoritos') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={30} 
              onClick={() => navigate('/favoritos')} 
            />
            
            <ShoppingCart 
              className={`cursor-pointer transition-colors snap-center ${isActive('/carrinho') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={30} 
              onClick={() => navigate('/carrinho')} 
            />

            <Settings 
              className={`lg:hidden cursor-pointer transition-colors snap-center ${isActive('/configuracoes') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
              size={30} 
              onClick={() => navigate('/configuracoes')} 
            />
          </div>
        </nav>

        {/* Seção Inferior - Desktop */}
        <div className="hidden lg:flex lg:flex-col items-center gap-8 mt-auto pt-6 border-t border-white/10 w-full">
          <Settings 
            className={`cursor-pointer transition-colors ${isActive('/configuracoes') ? 'text-white' : 'text-white/30 hover:text-white'}`} 
            size={30} 
            onClick={() => navigate('/configuracoes')} 
          />
          {user && (
            <LogOut 
              className="text-white/30 cursor-pointer hover:text-red-400 transition-colors" 
              size={30} 
              onClick={handleLogout} 
            />
          )}
        </div>
      </div>
    </aside>
  );
}