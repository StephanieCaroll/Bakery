import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  ArrowLeft, Star, Plus, Minus, ShoppingBag, 
  Tag, MessageSquare, Send, Trash2, User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails({ item, onBack, showNotification }) {
  const [quantity, setQuantity] = useState(1);
  const { user, addToCart, darkMode, isAdmin } = useAuth();
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  
  const isOutOfStock = item.stock <= 0;

  useEffect(() => {
    fetchComments();
  }, [item.id]);

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, "comments"), 
        where("productId", "==", item.id), 
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      setCommentsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("Faça login para comentar! 🧁");
      return;
    }
    if (!comment.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        productId: item.id,
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        text: comment,
        timestamp: new Date().toISOString()
      });
      setComment("");
      fetchComments();
      showNotification("Feedback enviado com sucesso! ✨");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Apagar este comentário permanentemente?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
        fetchComments();
        showNotification("Feedback removido! 🗑️");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddToCart = () => {
    if (isAdmin) {
      showNotification("Modo Admin: Checkout desativado. 🛡️");
      return;
    }
    if (quantity > item.stock) {
      showNotification(`Apenas ${item.stock} unidades disponíveis! ⚠️`);
      return;
    }
    addToCart(item, quantity);
    if (showNotification) {
      showNotification(`${quantity}x ${item.name} no carrinho! 🧁`);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <button 
        onClick={onBack} 
        className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-10 transition-colors w-fit ${
          darkMode ? 'text-white/60 hover:text-white' : 'text-[#bc232d] hover:opacity-70'
        }`}
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative group w-full max-w-lg lg:max-w-2xl">
            <img 
              src={item.image} 
              alt={item.name} 
              className={`relative w-full transition-transform duration-700 object-contain drop-shadow-2xl 
              ${isOutOfStock ? 'grayscale opacity-50' : 'hover:scale-105'}`}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-3 mb-6">
             <div className={`flex items-center gap-2 border w-fit px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-colors ${
              darkMode ? 'bg-white/10 border-white/20' : 'bg-white/40 border-white/20'
            }`}>
              <Star size={18} className={darkMode ? 'fill-white text-white' : 'fill-[#bc232d] text-[#bc232d]'} />
              <span className={`font-black text-sm ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{item.rating || "5.0"}</span>
            </div>

            <div className={`flex items-center gap-2 border w-fit px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-colors ${
              darkMode ? 'bg-white/10 border-white/20' : 'bg-white/40 border-white/20'
            }`}>
              <Tag size={16} className={darkMode ? 'text-white' : 'text-[#bc232d]'} />
              <span className={`font-black text-xs uppercase tracking-widest ${
                darkMode ? 'text-white' : 'text-[#bc232d]'
              }`}>
                {item.category || "Artesanal"}
              </span>
            </div>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.85] mb-6 uppercase tracking-tighter transition-colors ${
            darkMode ? 'text-white' : 'text-[#bc232d]'
          }`}>
            {item.name} {isOutOfStock && <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full align-middle ml-4 animate-pulse">ESGOTADO</span>}
          </h1>

          <p className={`text-lg lg:text-xl font-medium mb-10 leading-relaxed max-w-lg transition-colors ${
            darkMode ? 'text-white/80' : 'text-[#bc232d] opacity-90'
          }`}>
            {item.description || "Delicioso bolo artesanal preparado com os melhores ingredientes."}
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-center gap-8 lg:gap-12 mb-10">
              <div className="flex flex-col items-center lg:items-start">
                <span className={`text-xs font-black uppercase tracking-widest transition-colors ${
                  darkMode ? 'text-white/40' : 'text-[#bc232d] opacity-60'
                }`}>
                  Preço Individual (Estoque: {item.stock || 0})
                </span>
                <span className={`text-5xl lg:text-6xl font-black tracking-tighter transition-colors ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  R${item.price}
                </span>
              </div>

              <div className={`flex items-center gap-6 p-2 rounded-full border shadow-inner transition-colors ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'
              }`}>
                <button 
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className={`p-4 rounded-full shadow-lg active:scale-90 transition hover:brightness-110 disabled:opacity-30 ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <Minus size={24} strokeWidth={3} />
                </button>
                
                <span className={`font-black text-3xl w-12 text-center transition-colors ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  {isOutOfStock ? 0 : quantity}
                </span>

                <button 
                  disabled={isOutOfStock || quantity >= item.stock}
                  onClick={() => setQuantity(q => q + 1)}
                  className={`p-4 rounded-full shadow-lg active:scale-90 transition hover:brightness-110 disabled:opacity-30 ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
          </div>

          <button 
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-4 w-full max-w-md py-6 rounded-[2.5rem] font-black text-xl lg:text-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-tighter 
            ${isOutOfStock ? 'bg-zinc-500 text-white cursor-not-allowed' : (darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white')}
            ${isAdmin && !isOutOfStock ? 'opacity-50' : ''}`}
          >
            <ShoppingBag size={28} />
            {isOutOfStock ? 'Produto Esgotado' : isAdmin ? 'Admin - Sem Checkout' : `Adicionar - R$${(Number(item.price) * quantity).toFixed(2)}`}
          </button>
        </div>
      </div>

      <div className="mt-32 w-full max-w-5xl mx-auto flex flex-col items-center px-4">
        <div className="text-center mb-12">
            <h3 className={`text-4xl lg:text-5xl font-black uppercase tracking-tighter flex items-center justify-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
              <MessageSquare size={40} /> Feedback
            </h3>
            <p className={`font-bold uppercase text-[10px] tracking-[0.3em] opacity-50 mt-2 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
              O que os nossos clientes dizem
            </p>
        </div>

        <form onSubmit={handleSendComment} className="w-full max-w-2xl mb-16">
          <div className={`flex items-center gap-2 p-1.5 rounded-[2.5rem] border transition-all ${
            darkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-[#bc232d]/10 shadow-lg'
          }`}>
            <input 
              type="text" 
              placeholder="Escreva sua experiência..." 
              className={`min-w-0 flex-1 bg-transparent px-5 py-3 outline-none font-bold text-sm sm:text-base placeholder:opacity-30 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              type="submit" 
              className={`p-4 sm:p-5 rounded-full shadow-xl active:scale-95 transition-all flex items-center justify-center shrink-0 ${
                darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
              }`}
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 w-full">
          {commentsList.length === 0 ? (
            <div className={`col-span-full py-20 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center opacity-30 ${darkMode ? 'border-white/10 text-white' : 'border-[#bc232d]/10 text-[#bc232d]'}`}>
              <MessageSquare size={48} className="mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Seja o primeiro a avaliar!</p>
            </div>
          ) : (
            commentsList.map((c) => (
              <div key={c.id} className={`group p-6 sm:p-8 rounded-[3rem] relative border transition-all hover:scale-[1.02] ${
                darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-[#bc232d]/5 hover:shadow-xl shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg ${darkMode ? 'bg-zinc-800 text-white' : 'bg-[#bc232d] text-white'}`}>
                      <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-black uppercase text-xs sm:text-sm tracking-tighter truncate ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                        {c.userName}
                      </h4>
                      <p className={`text-[8px] sm:text-[9px] font-bold uppercase opacity-40 tracking-widest`}>
                        {new Date(c.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>

                  {(isAdmin || c.userId === user?.uid) && (
                    <button 
                      onClick={() => handleDeleteComment(c.id)} 
                      className="p-2 sm:p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <span className={`absolute -top-4 -left-2 text-3xl sm:text-4xl font-serif opacity-10 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>“</span>
                  <p className={`text-xs sm:text-sm lg:text-base leading-relaxed font-medium italic relative z-10 ${darkMode ? 'text-white/80' : 'text-[#bc232d]/80'}`}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}