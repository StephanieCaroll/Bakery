import React, { useState, useEffect } from 'react';
import { 
  Search, UtensilsCrossed, Heart, Star 
} from 'lucide-react';
import { db } from '../services/firebase'; 
import { collection, getDocs, query, where, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductDetails from './ProductDetails';
import Sidebar from '../components/SideBar'; 

const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

const GlobalLoading = ({ darkMode }) => (
  <div className={`flex flex-col items-center justify-center h-[100dvh] w-full animate-in fade-in duration-500 ${
    darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'
  }`}>
    <div className="animate-spin mb-4">
      <UtensilsCrossed size={40} />
    </div>
    <p className="font-black uppercase tracking-widest text-xs">Carregando...</p>
  </div>
);

// Componente de Alerta Personalizado (Toast)
const Toast = ({ message, show, onClose, darkMode }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 400);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-colors duration-500 ${
        darkMode 
        ? 'bg-zinc-800 border-white/10 text-white' 
        : 'bg-[#bc232d] border-white/20 text-white'
      }`}>
        <div className="bg-white/20 p-1.5 rounded-full">
          <UtensilsCrossed size={16} className="text-white" />
        </div>
        <span className="font-bold uppercase tracking-tighter text-sm">{message}</span>
      </div>
    </div>
  );
};

const CategoryFilter = ({ categories, selected, onSelect, darkMode }) => (
  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 mb-6">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
          selected === cat 
          ? (darkMode ? 'bg-white text-zinc-900 border-white' : 'bg-[#bc232d] text-white border-[#bc232d]') 
          : (darkMode ? 'bg-white/10 text-white border-transparent hover:bg-white/20' : 'bg-white/20 text-[#bc232d] border-transparent hover:bg-white/40')
        } shadow-lg scale-105`}
      >
        {cat}
      </button>
    ))}
  </div>
);

const ProductCard = ({ item, onSelect, bgColor, onFavorite, isFavorite, isMenuCard }) => (
  <div 
    onClick={() => onSelect(item)}
    style={{ backgroundColor: bgColor }} 
    className={`${isMenuCard ? 'w-full' : 'min-w-[75vw] sm:min-w-[280px] lg:min-w-0'} snap-center p-4 pt-14 rounded-[2.5rem] text-white relative flex flex-col h-44 shadow-xl transition-all hover:scale-105 cursor-pointer group mb-4`}
  >
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 flex items-center justify-center">
      <img 
        src={item.image} 
        alt={item.name} 
        className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:rotate-6 transition-transform duration-500" 
      />
    </div>

    <Heart 
      className={`absolute top-4 right-4 cursor-pointer transition-all duration-300 hover:scale-110 ${
        isFavorite ? 'fill-white text-white' : 'text-white/80 hover:text-white'
      }`} 
      size={24}
      onClick={(e) => {
        e.stopPropagation();
        onFavorite(item);
      }}
    />

    <div className="flex items-center gap-1 mt-10">
      <Star size={18} className="fill-white text-white" />
      <span className="text-[11px] font-bold">{item.rating || "5.0"}</span>
    </div>

    <h3 className="text-[15px] font-bold leading-tight mt-1 mb-2 truncate w-full pr-10 uppercase tracking-tighter">
      {item.name}
    </h3>

    <div className="absolute bottom-6 right-3">
      <div className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-full flex items-center justify-center shadow-lg border border-white/10">
        <span className="text-[10px] font-black italic tracking-tighter whitespace-nowrap">R$ {item.price}</span>
      </div>
    </div>
  </div>
);

export default function BakeryApp() {
  const navigate = useNavigate();
  const { user, darkMode } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [popularItems, setPopularItems] = useState([]); 
  const [userFavorites, setUserFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const categories = ["Todos", "Bolos", "Doces", "Pães", "Salgados", "Bebidas"];

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const favs = querySnapshot.docs.map(doc => ({
        favDocId: doc.id,
        productId: doc.data().productId
      }));
      setUserFavorites(favs);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (product) => {
    if (!user) { navigate('/login'); return; }
    const existingFavorite = userFavorites.find(f => f.productId === product.id);
    try {
      if (existingFavorite) {
        await deleteDoc(doc(db, "favorites", existingFavorite.favDocId));
        setUserFavorites(prev => prev.filter(f => f.productId !== product.id));
        showNotification("Removido dos favoritos 💔");
      } else {
        const docRef = await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          timestamp: new Date()
        });
        setUserFavorites(prev => [...prev, { favDocId: docRef.id, productId: product.id }]);
        showNotification(`${product.name} favoritado! 🤍`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPopularItems(productsList);
        setTimeout(() => setLoading(false), 400);
      } catch (error) { 
        setLoading(false);
      }
    };
    fetchProducts();
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    setCurrentDate(formattedDate);
  }, []);

  const menuItems = popularItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <GlobalLoading darkMode={darkMode} />;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'}`}>
      <style>{scrollbarHideStyle}</style>
      
      <Toast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
        darkMode={darkMode}
      />

      <Sidebar onLogoClick={() => setSelectedItem(null)} />

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-y-auto order-1 lg:order-2 shadow-2xl h-full transition-colors duration-500 border-none outline-none scrollbar-hide ${
        darkMode ? 'bg-zinc-900' : 'bg-[#f4a28c]'
      }`}>
        {!selectedItem ? (
          <>
            <header className="flex flex-col lg:flex-row justify-between lg:items-center mb-10 gap-6">
              <div className="relative w-full lg:w-7/12 h-12 rounded-full overflow-hidden">
                <div className="absolute inset-0" style={{ 
                  background: darkMode 
                    ? 'linear-gradient(to right, #27272a 0%, #27272a 45%, #18181b 100%)' 
                    : 'linear-gradient(to right, #e44444 0%, #e44444 45%, #f4a28c 100%)' 
                }}></div>
                <input 
                  type="text" 
                  placeholder="Pesquisar no cardápio..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full h-full bg-transparent px-14 text-white placeholder-white/70 outline-none font-bold" 
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90" size={22} />
              </div>

              <div className="flex justify-center lg:justify-end items-center w-full lg:w-auto">
                <span className={`${darkMode ? 'text-white/60' : 'text-[#bc232d]'} font-black text-lg uppercase tracking-tighter`}>
                  {currentDate}
                </span>
              </div>
            </header>

            <section className={`${darkMode ? 'bg-zinc-800' : 'bg-[#e44444]'} rounded-[2rem] lg:rounded-full p-8 flex items-center relative mb-12 lg:mb-16 lg:h-48 shadow-xl`}>
                <div className="hidden lg:block absolute -left-10 -top-8">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/047/814/133/small_2x/a-slice-of-strawberry-cake-with-strawberries-on-top-the-cake-is-cut-in-half-and-has-a-strawberry-on-each-half-isolated-on-a-transparent-background-png.png" alt="Bolo" className="w-72 h-60 object-contain drop-shadow-2xl" />
                </div>
                <div className="lg:ml-64 text-white text-center lg:text-left w-full">
                  <h1 className="text-2xl lg:text-4xl font-black uppercase leading-none mb-3 tracking-tighter">A Arte de Assar Memórias</h1>
                  <p className="text-xs lg:text-sm font-medium opacity-80 uppercase tracking-widest">Bolos artesanais para momentos inesquecíveis.</p>
                </div>
            </section>

            <section className="mb-20">
              <h2 className={`${darkMode ? 'text-white' : 'text-[#bc232d]'} text-3xl font-black mb-6 uppercase tracking-tighter text-center lg:text-left`}>
                Nosso Cardápio
              </h2>

              <CategoryFilter 
                categories={categories} 
                selected={selectedCategory} 
                onSelect={setSelectedCategory} 
                darkMode={darkMode}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 pt-10">
                {menuItems.map((item, index) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    onSelect={setSelectedItem} 
                    onFavorite={toggleFavorite}
                    isFavorite={userFavorites.some(f => f.productId === item.id)}
                    bgColor={darkMode 
                      ? (index % 2 === 0 ? '#27272a' : '#3f3f46') 
                      : (index % 2 === 0 ? '#E54C4D' : '#C51D28')
                    }
                    isMenuCard={true}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <ProductDetails 
            item={selectedItem} 
            onBack={() => setSelectedItem(null)} 
            showNotification={showNotification} 
          />
        )}
      </main>
    </div>
  );
}