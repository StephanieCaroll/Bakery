import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, doc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, PackageCheck, MapPin, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import Sidebar from '../components/SideBar';

export default function ConfirmOrder() {
  const { user, cart, clearCart, darkMode } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      
      const batch = writeBatch(db);

      const ordersRef = collection(db, "orders");
      const orderData = {
        userId: user.uid,
        userName: user.displayName || "Cliente",
        items: cart,
        total: total,
        status: "Pendente",
        createdAt: new Date().toISOString()
      };

      await addDoc(ordersRef, orderData);

      cart.forEach((item) => {
        const productRef = doc(db, "products", item.id);
       
        batch.update(productRef, {
          stock: increment(-item.quantity)
        });
      });

      await batch.commit();
      setOrderDone(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (orderDone) {
    return (
      <div className={`flex items-center justify-center h-screen w-full ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#f4a28c] text-[#bc232d]'}`}>
        <div className="text-center animate-in zoom-in duration-500">
          <CheckCircle2 size={80} className="mx-auto mb-6 text-green-500" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">Pedido Confirmado!</h2>
          <p className="font-bold opacity-70 mt-2">Estamos preparando suas delícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      
      <Sidebar />

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-y-auto order-1 lg:order-2 shadow-2xl h-full transition-colors duration-500 scrollbar-hide pb-32 lg:pb-12 ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-8 font-black uppercase tracking-widest text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={18} /> Voltar ao Carrinho
          </button>

          <h2 className="text-4xl lg:text-5xl font-black mb-10 uppercase tracking-tighter flex items-center gap-4">
            <PackageCheck size={40} /> Resumo do Pedido
          </h2>

          <div className="flex flex-col gap-6">
            {/* Itens do Pedido */}
            <div className={`p-8 rounded-[2.5rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'}`}>
              <h3 className="font-black uppercase text-sm mb-6 opacity-60 tracking-widest">Produtos Selecionados</h3>
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-black/5 pb-4">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-lg">{item.quantity}x</span>
                      <span className="font-bold uppercase text-sm">{item.name}</span>
                    </div>
                    <span className="font-black">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-8 pt-4">
                <span className="text-2xl font-black uppercase tracking-tighter">Total</span>
                <span className="text-3xl font-black italic">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Simulação de Endereço/Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'}`}>
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <MapPin size={18} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Entrega</span>
                </div>
                <p className="font-bold text-sm uppercase">Endereço Cadastrado no Perfil</p>
              </div>

              <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'}`}>
                <div className="flex items-center gap-2 mb-4 opacity-60">
                  <CreditCard size={18} />
                  <span className="font-black uppercase text-[10px] tracking-widest">Pagamento</span>
                </div>
                <p className="font-bold text-sm uppercase">Pagar na Entrega (Cartão/Pix)</p>
              </div>
            </div>

            <button 
              onClick={handleConfirmOrder}
              disabled={loading || cart.length === 0}
              className={`w-full py-6 mt-4 rounded-[2.5rem] font-black text-xl uppercase tracking-tighter shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                darkMode ? 'bg-white text-zinc-950' : 'bg-[#bc232d] text-white'
              } disabled:opacity-50`}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Confirmar e Finalizar Pedido"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}