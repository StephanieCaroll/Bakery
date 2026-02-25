import React, { useState, useEffect } from 'react';
import { db } from "../services/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/SideBar";

const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function OrdersManager() {
  const navigate = useNavigate();
  const { darkMode, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ daily: 0, monthly: 0 });

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(lista);
      calcularFaturamento(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const calcularFaturamento = (lista) => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    let dia = 0, mes = 0;
    lista.forEach(order => {
      if (!order.timestamp) return;
      const dataPedido = order.timestamp.toDate();
      if (dataPedido.toLocaleDateString('pt-BR') === hoje) dia += Number(order.total);
      if (dataPedido.getMonth() === mesAtual && dataPedido.getFullYear() === anoAtual) mes += Number(order.total);
    });
    setStats({ daily: dia, monthly: mes });
  };

  const updateStatus = async (orderId, newStatus) => {
    try { await updateDoc(doc(db, "orders", orderId), { status: newStatus }); } 
    catch (error) { console.error(error); }
  };

  const deletarPedido = async (id) => {
    if (window.confirm("Remover este pedido?")) await deleteDoc(doc(db, "orders", id));
  };

  const statusColors = {
    "Pendente": "bg-amber-500/20 text-amber-500",
    "Preparando": "bg-blue-500/20 text-blue-500",
    "Saiu para Entrega": "bg-purple-500/20 text-purple-500",
    "Concluído": "bg-green-500/20 text-green-600 border-green-500/50"
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#bc232d] text-white font-bold">CARREGANDO...</div>;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] w-full font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      <style>{scrollbarHideStyle}</style>
      
      <div className="order-2 lg:order-first z-50">
        <Sidebar />
      </div>

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-y-auto shadow-2xl transition-colors duration-500 border-none outline-none scrollbar-hide order-1 lg:order-2 ${
        darkMode ? 'bg-zinc-900' : 'bg-[#f4a28c]'
      }`}>
        
        <div className="max-w-6xl mx-auto flex flex-col py-4">
          <header className="mb-10 text-center lg:text-left">
             <h2 className={`text-4xl lg:text-6xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                Gestão de Pedidos
             </h2>
          </header>

          {/* Cards de Faturamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className={`${darkMode ? 'bg-white/5' : 'bg-white/40'} p-8 rounded-[3rem] border border-white/20 backdrop-blur-md shadow-xl flex items-center gap-6`}>
              <DollarSign size={32} className="text-green-500" />
              <div>
                <p className="text-[10px] font-black uppercase opacity-50">Hoje</p>
                <p className="text-3xl font-black">R$ {stats.daily.toFixed(2)}</p>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-white/5' : 'bg-white/40'} p-8 rounded-[3rem] border border-white/20 backdrop-blur-md shadow-xl flex items-center gap-6`}>
              <Calendar size={32} className="text-blue-500" />
              <div>
                <p className="text-[10px] font-black uppercase opacity-50">Mês</p>
                <p className="text-3xl font-black">R$ {stats.monthly.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pb-24">
            {orders.map(order => (
              <div key={order.id} className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'} p-8 rounded-[3rem] border shadow-2xl`}>
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <ShoppingBag className={darkMode ? 'text-white' : 'text-[#bc232d]'} size={28} />
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tighter">{order.customerName}</h4>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Pendente", "Preparando", "Saiu para Entrega", "Concluído"].map(s => (
                      <button key={s} onClick={() => updateStatus(order.id, s)} className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase border ${order.status === s ? 'bg-white text-black' : 'opacity-40'}`}>{s}</button>
                    ))}
                    <button onClick={() => deletarPedido(order.id)} className="p-2 text-red-500"><Trash2 size={20} /></button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-black/5 flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="bg-black/5 px-3 py-1 rounded-lg text-[10px] font-bold">{item.quantity}x {item.name}</span>
                      ))}
                    </div>
                    <p className="text-2xl font-black italic">R$ {Number(order.total).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}