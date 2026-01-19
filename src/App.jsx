import React, { useState, useEffect } from 'react';
import { 
  Search, Home, User, Heart, Settings, 
  LogOut, UtensilsCrossed, Star 
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import ProductDetails from './ProductDetails';

const ProductCard = ({ item, onSelect, bgColor }) => (
  <div 
    onClick={() => onSelect(item)}
    style={{ backgroundColor: bgColor }} 
    className="p-4 pt-14 rounded-[2.5rem] text-white relative flex flex-col h-44 shadow-xl transition-all hover:scale-105 cursor-pointer"
  >
    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-36 h-36 object-cover rounded-full border-none" 
      />
    </div>

    <div className="flex items-center gap-1 mt-10">
      <Star size={20} className="fill-white text-white" />
      <span className="text-[11px] font-bold">{item.rating}</span>
    </div>

    <h3 className="text-[15px] font-bold leading-tight mt-1 mb-2 truncate w-full pr-14" title={item.name}>
      {item.name}
    </h3>

    <div className="absolute bottom-8 right-3">
      <div className="bg-[#ae1f23] w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/5">
        <span className="text-[10px] font-black italic">R${item.price}</span>
      </div>
    </div>
  </div>
);

export default function BakeryApp() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [popularItems, setPopularItems] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Busca de produtos do Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPopularItems(productsList);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Data Dinâmica
  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('pt-BR', { month: 'long' });
    const year = today.getFullYear();
    const formattedDate = `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="flex h-screen bg-[#bc232d] font-sans overflow-hidden">
      
      {/* Sidebar Lateral */}
      <aside className="w-24 flex flex-col items-center py-12 justify-between">
        <div className="flex flex-col items-center gap-14">
          <div className="bg-white p-3 rounded-full text-[#bc232d] shadow-lg cursor-pointer" onClick={() => setSelectedItem(null)}>
            <UtensilsCrossed size={32} />
          </div>
          <nav className="flex flex-col gap-12 text-white/50">
            <Home className={`${!selectedItem ? 'text-white' : ''} cursor-pointer`} size={28} onClick={() => setSelectedItem(null)} />
            <User className="cursor-pointer hover:text-white transition" size={28} />
            <Heart className="cursor-pointer hover:text-white transition" size={28} />
            <Settings className="cursor-pointer hover:text-white transition" size={28} />
          </nav>
        </div>
        <LogOut className="text-white/50 cursor-pointer hover:text-white transition" size={28} />
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 bg-[#f4a28c] rounded-l-[5rem] p-12 overflow-y-auto relative shadow-2xl">
        
        {!selectedItem ? (
          <>
            <header className="flex justify-between items-center mb-14">
              <div className="relative w-7/12 h-12 ml-10">
                <div 
                  className="absolute inset-0 rounded-full border-none shadow-none"
                  style={{ background: 'linear-gradient(to right, #e44444 0%, #e44444 55%, #f4a28c 100%)' }}
                ></div>
                <input type="text" className="relative w-full h-full bg-transparent rounded-full px-14 border-none text-white placeholder-white/70 outline-none z-10" />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90 z-20" size={22} />
              </div>
              <span className="text-[#bc232d] font-bold text-xl tracking-tight">{currentDate}</span>
            </header>

            <section className="bg-[#e44444] rounded-full p-8 flex items-center relative mb-24 h-48 shadow-2xl ml-8">
              <div className="absolute -left-25 -top-12">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/047/814/133/small_2x/a-slice-of-strawberry-cake-with-strawberries-on-top-the-cake-is-cut-in-half-and-has-a-strawberry-on-each-half-isolated-on-a-transparent-background-png.png" alt="Bolo Principal" className="w-100 h-74 object-contain " />
              </div>
              <div className="ml-56 pr-12 text-white flex flex-col justify-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-3 text-white">A Arte de Assar Memórias</h1>
                <p className="text-sm font-medium opacity-80 max-w-sm text-white">Bolos artesanais que transformam momentos simples em grandes memórias.</p>
              </div>
            </section>

            <section className="mb-20">
              <h2 className="text-[#bc232d] text-2xl font-black mb-12">Popular <span className="font-normal text-lg ml-2 italic opacity-80">esta semana</span></h2>
              
              {loading ? (
                <div className="text-[#bc232d] font-bold text-center w-full">Carregando delícias...</div>
              ) : (
                <div className="grid grid-cols-4 gap-x-8 gap-y-20 px-2">
                  {popularItems.map((item, index) => {
                   
                   // Lógica para alternar as cores: 
                    // Se o índice for par, usa E54C4D. Se for ímpar, usa C51D28.
                    const bgColor = index % 2 === 0 ? '#E54C4D' : '#C51D28';
                    
                    return (
                      <ProductCard 
                        key={item.id} 
                        item={item} 
                        onSelect={setSelectedItem} 
                        bgColor={bgColor}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : (
          <ProductDetails item={selectedItem} onBack={() => setSelectedItem(null)} />
        )}

      </main>
    </div>
  );
}