import React, { useState, useEffect } from 'react';
import { db } from "../services/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from "../context/AuthContext";
import { 
  ShoppingBag, DollarSign, Calendar, Trash2, 
  CheckCircle2, Truck, Utensils
} from 'lucide-react';
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
  const [filtroStatus, setFiltroStatus] = useState("Todos");

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
      if (!order.timestamp || !order.total) return;
      const dataPedido = order.timestamp.toDate();
      const valor = parseFloat(order.total) || 0;
      if (dataPedido.toLocaleDateString('pt-BR') === hoje) dia += valor;
      if (dataPedido.getMonth() === mesAtual && dataPedido.getFullYear() === anoAtual) mes += valor;
    });
    setStats({ daily: dia, monthly: mes });
  };

  const getWhatsAppUrl = (order, newStatus) => {
  
    const rawPhone = order.phone || order.telefone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "");

    if (!cleanPhone) return null;

    let msg = "";
    if (newStatus === "Preparando") {
      msg = `Oi ${order.customerName}! 🧁 Passando para avisar que já estamos preparando o seu pedido com muito carinho aqui na Bakery! 👨‍🍳`;
    } else if (newStatus === "Saiu para Entrega") {
      msg = `Boas notícias, ${order.customerName}! 🚚💨 Seu pedido acabou de sair para entrega e logo chegará até você!`;
    } else if (newStatus === "Concluído") {
      msg = `Pedido entregue! ✨\n\nMuito obrigado pela preferência, ${order.customerName}! Esperamos que ame cada pedaço. 🍰\n\nSe puder, nos marque no Instagram @stephaniecarolinedev! ❤️`;
    }

    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  // FUNÇÃO QUE UNE O LINK COM A ATUALIZAÇÃO 
  const handleStatusChange = (order, newStatus) => {
    const url = getWhatsAppUrl(order, newStatus);
    
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("⚠️ Não encontrei o telefone deste cliente no pedido. Verifique o cadastro dele.");
    }

    const orderRef = doc(db, "orders", order.id);
    updateDoc(orderRef, { 
      status: newStatus,
      updatedAt: new Date() 
    }).catch(err => console.error("Erro no Firebase:", err));
  };

  const deletarPedido = async (id) => {
    if (window.confirm("Remover este pedido?")) await deleteDoc(doc(db, "orders", id));
  };

  const statusColors = {
    "Pendente": "bg-amber-500 text-white",
    "Preparando": "bg-blue-500 text-white",
    "Saiu para Entrega": "bg-purple-500 text-white",
    "Concluído": "bg-green-600 text-white"
  };

  const pedidosFiltrados = filtroStatus === "Todos" ? orders : orders.filter(o => o.status === filtroStatus);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#bc232d] text-white font-black animate-pulse">CARREGANDO...</div>;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] w-full font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'
    }`}>
      <style>{scrollbarHideStyle}</style>
      <Sidebar />

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-y-auto shadow-2xl transition-colors duration-500 scrollbar-hide order-1 lg:order-2 ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        
        <div className="max-w-6xl mx-auto py-4 text-inherit">
          <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
             <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.8]">
               Gestão de<br/>Pedidos
             </h2>

             <div className="flex flex-wrap gap-2 p-2 rounded-3xl bg-black/5 backdrop-blur-sm">
                {["Todos", "Pendente", "Preparando", "Saiu para Entrega", "Concluído"].map(s => (
                  <button key={s} onClick={() => setFiltroStatus(s)}
                    className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filtroStatus === s ? (darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white') : 'opacity-50 hover:opacity-100'
                    }`}>
                    {s}
                  </button>
                ))}
             </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-white">
            <div className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'} p-8 rounded-[3rem] border shadow-xl flex items-center gap-6`}>
              <div className="bg-green-500 p-4 rounded-3xl text-white shadow-lg"><DollarSign size={32} /></div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Faturamento Hoje</p>
                <p className="text-4xl font-black italic tracking-tighter">R$ {stats.daily.toFixed(2)}</p>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20'} p-8 rounded-[3rem] border shadow-xl flex items-center gap-6`}>
              <div className="bg-blue-500 p-4 rounded-3xl text-white shadow-lg"><Calendar size={32} /></div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Faturamento Mês</p>
                <p className="text-4xl font-black italic tracking-tighter">R$ {stats.monthly.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 pb-32">
            {pedidosFiltrados.map(order => (
              <div key={order.id} className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/20'} p-8 rounded-[4rem] border shadow-2xl transition-all`}>
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-[2rem] shadow-lg ${statusColors[order.status] || 'bg-zinc-500'}`}>
                      <ShoppingBag size={30} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">{order.customerName}</h4>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => handleStatusChange(order, "Preparando")} className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${order.status === "Preparando" ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'opacity-40 border-current hover:opacity-100'}`}><Utensils size={14} /> Preparar</button>
                    <button onClick={() => handleStatusChange(order, "Saiu para Entrega")} className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${order.status === "Saiu para Entrega" ? 'bg-purple-500 text-white border-purple-500 shadow-lg' : 'opacity-40 border-current hover:opacity-100'}`}><Truck size={14} /> Saiu para Entrega</button>
                    <button onClick={() => handleStatusChange(order, "Concluído")} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${order.status === "Concluído" ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'}`}><CheckCircle2 size={16} /> Concluir</button>
                    <button onClick={() => deletarPedido(order.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl ml-4"><Trash2 size={22} /></button>
                  </div>
                </div>
                
                <div className={`mt-8 pt-8 border-t flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                    <div className="flex flex-wrap gap-3 text-inherit">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${darkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-[#bc232d]'}`}>
                           <span className="font-black">{item.quantity}x</span>
                           <span className="font-bold uppercase text-[11px] tracking-tight">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right text-inherit">
                      <p className="text-[10px] font-black uppercase opacity-40 mb-1">Total do Pedido</p>
                      <p className="text-4xl font-black italic tracking-tighter">R$ {parseFloat(order.total || 0).toFixed(2)}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}