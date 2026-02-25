import React, { useState } from 'react';
import { auth, db } from "../services/firebase";
import { collection, addDoc } from 'firebase/firestore';
import { ArrowLeft, Save, Loader2, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";

export default function FormProduto() {
  const navigate = useNavigate();
  const { darkMode } = useAuth(); 
  const [loading, setLoading] = useState(false);
  
  const [produto, setProduto] = useState({
    name: '',
    price: '',
    rating: '',
    image: '',
    description: '',
    category: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!produto.category) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        ...produto,
        price: Number(produto.price),
        rating: Number(produto.rating)
      });
      
      alert("Produto cadastrado com sucesso! 🧁");
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `w-full border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#bc232d] transition-colors ${
    darkMode 
    ? 'bg-white/10 text-white placeholder-white/30' 
    : 'bg-white/50 text-[#bc232d] placeholder-[#bc232d]/50'
  }`;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      
      <Sidebar onLogoClick={() => navigate('/')} />

      {/* Container Principal */}
      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-y-auto order-1 lg:order-2 shadow-2xl h-full transition-colors duration-500 border-none outline-none scrollbar-hide ${
        darkMode ? 'bg-zinc-900' : 'bg-[#f4a28c]'
      }`}>
        
        <div className="max-w-3xl mx-auto py-4">
          <button 
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-10 transition-colors ${
              darkMode ? 'text-white/60 hover:text-white' : 'text-[#bc232d] hover:opacity-70'
            }`}
          >
            <ArrowLeft size={20} /> Voltar para Vitrine
          </button>

          <div className={`${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/20'
          } backdrop-blur-md p-8 lg:p-12 rounded-[3rem] shadow-2xl border transition-colors`}>
            
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'}`}>
                <UtensilsCrossed size={32} />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-black uppercase tracking-tighter ${
                darkMode ? 'text-white' : 'text-[#bc232d]'
              }`}>
                Cadastrar Produto
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Nome */}
              <input 
                type="text" placeholder="Nome do Produto" required
                className={inputStyle}
                value={produto.name}
                onChange={(e) => setProduto({...produto, name: e.target.value})}
              />
              
              {/* Categoria */}
              <select 
                required
                className={`${inputStyle} appearance-none cursor-pointer`}
                value={produto.category}
                onChange={(e) => setProduto({...produto, category: e.target.value})}
              >
                <option value="" disabled className={darkMode ? 'bg-zinc-800' : 'bg-white'}>Selecione uma Categoria</option>
                <option value="Bolos" className={darkMode ? 'bg-zinc-800' : 'bg-white'}>Bolos</option>
                <option value="Doces" className={darkMode ? 'bg-zinc-800' : 'bg-white'}>Doces</option>
                <option value="Pães" className={darkMode ? 'bg-zinc-800' : 'bg-white'}>Pães</option>
                <option value="Salgados" className={darkMode ? 'bg-zinc-800' : 'bg-white'}>Salgados</option>
                <option value="Bebidas" className={darkMode ? 'bg-zinc-800' : 'bg-white'}>Bebidas</option>
              </select>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Preço */}
                <input 
                  type="number" step="0.01" placeholder="Preço (R$)" required
                  className={inputStyle}
                  value={produto.price}
                  onChange={(e) => setProduto({...produto, price: e.target.value})}
                />
                {/* Avaliação */}
                <input 
                  type="number" step="0.1" max="5" placeholder="Avaliação (0-5)" required
                  className={inputStyle}
                  value={produto.rating}
                  onChange={(e) => setProduto({...produto, rating: e.target.value})}
                />
              </div>

              {/* Imagem */}
              <input 
                type="text" placeholder="URL da Imagem" required
                className={inputStyle}
                value={produto.image}
                onChange={(e) => setProduto({...produto, image: e.target.value})}
              />

              {/* Descrição */}
              <textarea 
                placeholder="Descrição do Produto" rows="4" required
                className={`${inputStyle} resize-none`}
                value={produto.description}
                onChange={(e) => setProduto({...produto, description: e.target.value})}
              ></textarea>

              <button 
                type="submit" 
                disabled={loading}
                className={`font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-tighter text-xl ${
                  darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}