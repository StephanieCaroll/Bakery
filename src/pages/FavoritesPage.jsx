import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, Trash2, UtensilsCrossed, Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import Sidebar from '../components/SideBar'; // Importando a Sidebar única

// Componente de Carregamento Global (Sincronizado com Home e Perfil)
const GlobalLoading = ({ darkMode }) => (
  <div className={`flex flex-col items-center justify-center h-[100dvh] w-full animate-in fade-in duration-500 ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'}`}>
    <div className="animate-spin mb-4">
      <UtensilsCrossed size={40} />
    </div>
    <p className="font-black uppercase tracking-widest text-xs">Carregando Favoritos...</p>
  </div>
);

export default function FavoritesPage() {
  const { user, logout, darkMode } = useAuth();
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
      setTimeout(() => setLoading(false), 400);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
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
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#f4a28c] text-[#bc232d]'}`}>
        <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Login Necessário</h2>
        <button onClick={() => navigate('/login')} className={`px-8 py-3 rounded-full font-bold shadow-xl ${darkMode ? 'bg-white text-zinc-950' : 'bg-[#bc232d] text-white'}`}>FAZER LOGIN</button>
      </div>
    );
  }

  if (loading) return <GlobalLoading darkMode={darkMode} />;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'}`}>
      
      <Sidebar onLogoClick={() => {
        setSelectedProduct(null);
        navigate('/');
      }} />

      {/* CONTEÚDO PRINCIPAL */}
      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 scrollbar-hide transition-colors duration-500 border-none outline-none ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        {!selectedProduct ? (
          <div className="max-w-5xl mx-auto py-4">
           {/* Favoritos */}
            <h2 className={`text-4xl lg:text-5xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter  ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
              <Heart size={40} fill={darkMode ? "#fff" : "#bc232d"} /> Meus Favoritos
            </h2>

            {favorites.length === 0 ? (
              <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/20 border-white/20'} backdrop-blur-md rounded-[3rem] p-16 text-center border transition-colors`}>
                <p className={`text-lg font-bold opacity-60 uppercase ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Nenhum favorito encontrado 🧁</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {favorites.map((item) => (
                  <div key={item.favId} onClick={() => setSelectedProduct(item)} className={`${darkMode ? 'bg-zinc-800 border-white/5' : 'bg-white/50 border-white/20'} backdrop-blur-md p-4 rounded-[2.5rem] border shadow-lg flex items-center gap-5 cursor-pointer hover:scale-[1.02] transition-all group min-h-[140px]`}>
                    <div className="relative flex-shrink-0 w-24 h-24 bg-white rounded-3xl overflow-hidden shadow-md">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-1 right-1 bg-[#bc232d] text-white p-1 rounded-full shadow-md"><Star size={8} fill="white" /></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                      <div>
                        <h3 className={`font-black text-xl leading-tight uppercase tracking-tighter mb-1 break-words ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{item.name}</h3>
                        <p className={`font-black text-lg opacity-80 leading-none ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>R${item.price}</p>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <button className={`px-5 py-2.5 rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition flex-1 font-black text-xs uppercase tracking-widest ${darkMode ? 'bg-white text-zinc-950' : 'bg-[#bc232d] text-white'}`}>Pedir</button>
                        <button onClick={(e) => removeFavorite(e, item.favId)} className={`${darkMode ? 'bg-white/10 text-white' : 'bg-white/70 text-[#bc232d]'} p-2.5 rounded-2xl shadow-sm hover:bg-red-500 hover:text-white active:scale-90 transition`}><Trash2 size={18}/></button>
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