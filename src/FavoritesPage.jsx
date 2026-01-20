import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { 
  ArrowLeft, Heart, Trash2, ShoppingCart, 
  Home, User, Settings, UtensilsCrossed, LogOut, Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductDetails from './ProductDetails';

export default function FavoritesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const favList = querySnapshot.docs.map(doc => ({
        favId: doc.id,
        ...doc.data()
      }));
      setFavorites(favList);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (e, favId) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "favorites", favId));
      setFavorites(favorites.filter(item => item.favId !== favId));
    } catch (error) {
      alert("Erro ao remover dos favoritos");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f4a28c] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-[#bc232d] mb-4 uppercase tracking-tighter">Login Necessário</h2>
        <button onClick={() => navigate('/login')} className="bg-[#bc232d] text-white px-8 py-3 rounded-full font-bold shadow-xl">FAZER LOGIN</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#bc232d] font-sans overflow-hidden">
      
      {/* SIDEBAR  */}
      <aside className="w-full lg:w-24 h-20 lg:h-full bg-[#bc232d] flex lg:flex-col items-center py-4 lg:py-12 justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10 px-6 lg:px-0 z-50">
        <div className="flex lg:flex-col items-center gap-6 lg:gap-14 w-full justify-around lg:justify-start">
          <div className="hidden lg:flex bg-white p-3 rounded-full text-[#bc232d] shadow-lg cursor-pointer" onClick={() => navigate('/')}>
            <UtensilsCrossed size={32} />
          </div>
          <nav className="flex lg:flex-col gap-8 lg:gap-12 text-white/50 w-full justify-around lg:items-center">
            <Home className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/')} />
            <User className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/perfil')} />
            <Heart className="text-white" size={28} />
            <ShoppingCart className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/carrinho')} />
            <Settings className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/configuracoes')} />
          </nav>
        </div>
        <LogOut className="text-white/50 cursor-pointer hover:text-white hidden lg:block" size={28} onClick={handleLogout} />
      </aside>

      {/* CONTEÚDO COM SCROLL */}
      <main className="flex-1 bg-[#f4a28c] lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12">
        {!selectedProduct ? (
          <div className="max-w-5xl mx-auto py-4">
            
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-[#bc232d] font-black uppercase tracking-widest text-sm mb-10 hover:translate-x-[-5px] transition-transform"
            >
              <ArrowLeft size={20} /> Voltar ao Cardápio
            </button>

            <h2 className="text-4xl lg:text-5xl font-black text-[#bc232d] mb-12 flex items-center gap-4 uppercase tracking-tighter">
              <Heart size={40} fill="#bc232d" /> Meus Favoritos
            </h2>

            {loading ? (
              <div className="font-black text-[#bc232d] animate-pulse uppercase tracking-widest">Carregando...</div>
            ) : favorites.length === 0 ? (
              <div className="bg-white/20 backdrop-blur-md rounded-[3rem] p-16 text-center border border-white/20">
                <p className="text-[#bc232d] text-lg font-bold opacity-60 uppercase">Nenhum favorito encontrado 🧁</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {favorites.map((item) => (
                  <div 
                    key={item.favId} 
                    onClick={() => setSelectedProduct(item)}
                    className="bg-white/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/20 shadow-lg flex items-center gap-5 cursor-pointer hover:scale-[1.02] transition-all group min-h-[140px]"
                  >
                   
                    <div className="relative flex-shrink-0 w-24 h-24 bg-white rounded-3xl overflow-hidden shadow-md">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute top-1 right-1 bg-[#bc232d] text-white p-1 rounded-full shadow-md">
                        <Star size={8} fill="white" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                      <div>
                        <h3 className="text-[#bc232d] font-black text-xl leading-tight uppercase tracking-tighter mb-1 break-words">
                          {item.name}
                        </h3>
                        <p className="text-[#bc232d] font-black text-lg opacity-80 leading-none">
                          R${item.price}
                        </p>
                      </div>
                      
                      <div className="flex gap-3 mt-3">
                        <button className="bg-[#bc232d] text-white px-5 py-2.5 rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition flex-1 font-black text-xs uppercase tracking-widest">
                          Pedir
                        </button>
                        <button 
                          onClick={(e) => removeFavorite(e, item.favId)} 
                          className="bg-white/70 text-[#bc232d] p-2.5 rounded-2xl shadow-sm hover:bg-white hover:text-red-600 active:scale-90 transition"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ProductDetails item={selectedProduct} onBack={() => setSelectedProduct(null)} />
        )}
      </main>
    </div>
  );
}