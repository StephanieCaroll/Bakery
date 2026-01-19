import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FormProduto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [produto, setProduto] = useState({
    name: '',
    price: '',
    rating: '',
    image: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
     
      await addDoc(collection(db, "products"), {
        ...produto,
        price: Number(produto.price),
        rating: Number(produto.rating)
      });
      
      alert("Produto cadastrado com sucesso!");
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4a28c] p-12 flex flex-col items-center">
      <button 
        onClick={() => navigate('/')}
        className="self-start flex items-center gap-2 text-[#bc232d] font-bold mb-8 hover:opacity-70 transition"
      >
        <ArrowLeft size={24} /> Voltar para Vitrine
      </button>

      <div className="bg-white/30 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl w-full max-w-2xl border border-white/20">
        <h2 className="text-4xl font-black text-[#bc232d] mb-8 uppercase tracking-tighter">Cadastrar Novo Bolo</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input 
            type="text" placeholder="Nome do Produto" required
            className="bg-white/50 border-none rounded-2xl p-4 text-[#bc232d] placeholder-[#bc232d]/50 outline-none focus:ring-2 focus:ring-[#bc232d]"
            onChange={(e) => setProduto({...produto, name: e.target.value})}
          />
          
          <div className="flex gap-4">
            <input 
              type="number" step="0.01" placeholder="Preço (R$)" required
              className="flex-1 bg-white/50 border-none rounded-2xl p-4 text-[#bc232d] outline-none focus:ring-2 focus:ring-[#bc232d]"
              onChange={(e) => setProduto({...produto, price: e.target.value})}
            />
            <input 
              type="number" step="0.1" max="5" placeholder="Avaliação (0-5)" required
              className="flex-1 bg-white/50 border-none rounded-2xl p-4 text-[#bc232d] outline-none focus:ring-2 focus:ring-[#bc232d]"
              onChange={(e) => setProduto({...produto, rating: e.target.value})}
            />
          </div>

          <input 
            type="text" placeholder="URL da Imagem" required
            className="bg-white/50 border-none rounded-2xl p-4 text-[#bc232d] outline-none focus:ring-2 focus:ring-[#bc232d]"
            onChange={(e) => setProduto({...produto, image: e.target.value})}
          />

          <textarea 
            placeholder="Descrição do Produto" rows="4" required
            className="bg-white/50 border-none rounded-2xl p-4 text-[#bc232d] outline-none focus:ring-2 focus:ring-[#bc232d] resize-none"
            onChange={(e) => setProduto({...produto, description: e.target.value})}
          ></textarea>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#bc232d] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            SALVAR NO FIREBASE
          </button>
        </form>
      </div>
    </div>
  );
}