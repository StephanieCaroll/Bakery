import React, { useState, useEffect } from 'react';
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ArrowLeft, Save, Loader2, UtensilsCrossed, Trash2, Edit3, CheckCircle2, AlertCircle, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";

const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

const CustomToast = ({ message, show, onClose, darkMode, type = "success" }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] max-w-md">
      <div className={`px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-all ${
        darkMode 
        ? 'bg-zinc-800 border-white/10 text-white' 
        : 'bg-white border-zinc-200 text-[#bc232d]'
      }`}>
        {type === "success" ? (
          <CheckCircle2 size={20} className="text-green-500" />
        ) : (
          <AlertCircle size={20} className="text-red-500" />
        )}
        <span className="font-black uppercase tracking-tighter text-sm">{message}</span>
      </div>
    </div>
  );
};

export default function FormProduto() {
  const navigate = useNavigate();
  const { darkMode, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [meusProdutos, setMeusProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [porcentagem, setPorcentagem] = useState('');
  const [precoFinalCalculado, setPrecoFinalCalculado] = useState(null);

  const [produto, setProduto] = useState({
    name: '', price: '', oldPrice: '', rating: '', image: '', description: '', category: ''
  });

  const showMsg = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (!isAdmin) navigate('/');
    carregarProdutos();
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (produto.oldPrice && porcentagem) {
      const valorBase = parseFloat(produto.oldPrice);
      const desconto = (valorBase * parseFloat(porcentagem)) / 100;
      const resultado = valorBase - desconto;
      const formatado = resultado.toFixed(2);
      setPrecoFinalCalculado(formatado);
      setProduto(prev => ({ ...prev, price: formatado }));
    } else {
      setPrecoFinalCalculado(null);
    }
  }, [porcentagem, produto.oldPrice]);

  const carregarProdutos = async () => {
    try {
      const q = query(collection(db, "products"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMeusProdutos(lista);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dados = {
        ...produto,
        price: Number(produto.price),
        oldPrice: produto.oldPrice ? Number(produto.oldPrice) : null,
        rating: Number(produto.rating)
      };

      if (editandoId) {
        await updateDoc(doc(db, "products", editandoId), dados);
        showMsg("Produto atualizado! ✨");
      } else {
        await addDoc(collection(db, "products"), dados);
        showMsg("Novo produto cadastrado! 🧁");
      }
      limparFormulario();
      carregarProdutos();
    } catch (error) {
      showMsg("Erro ao salvar.", "error");
    } finally { setLoading(false); }
  };

  const prepararEdicao = (item) => {
    setEditandoId(item.id);
    setProduto({ ...item, oldPrice: item.oldPrice || item.price });
    setPorcentagem('');
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setPorcentagem('');
    setProduto({ name: '', price: '', oldPrice: '', rating: '', image: '', description: '', category: '' });
  };

  const deletarProduto = async (id) => {
    if (window.confirm("Deseja apagar permanentemente?")) {
      await deleteDoc(doc(db, "products", id));
      carregarProdutos();
      showMsg("Produto removido! 🗑️");
    }
  };

  const inputStyle = `w-full border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#bc232d] transition-all ${
    darkMode ? 'bg-white/10 text-white placeholder-white/30' : 'bg-white/50 text-[#bc232d] placeholder-[#bc232d]/50 shadow-inner'
  }`;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      <style>{scrollbarHideStyle}</style>
      <CustomToast show={toast.show} message={toast.message} type={toast.type} darkMode={darkMode} onClose={() => setToast({ ...toast, show: false })} />
      
      {/* SIDEBAR NA ESQUERDA */}
      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-hidden order-1 lg:order-2 shadow-2xl h-full transition-colors duration-500 border-none outline-none scrollbar-hide ${
        darkMode ? 'bg-zinc-900' : 'bg-[#f4a28c]'
      }`}>
        
        <div className="max-w-6xl mx-auto h-full flex flex-col py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full overflow-hidden">
            
            {/* Formulário */}
            <div className={`flex flex-col h-fit ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/20'} backdrop-blur-md p-8 rounded-[3rem] `}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'}`}>
                  <UtensilsCrossed size={32} />
                </div>
                <h2 className={`text-2xl lg:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                  {editandoId ? 'Editar Item' : 'Cadastrar'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="Nome do Produto" required className={inputStyle} value={produto.name} onChange={(e) => setProduto({...produto, name: e.target.value})} />
                <select required className={`${inputStyle} appearance-none cursor-pointer`} value={produto.category} onChange={(e) => setProduto({...produto, category: e.target.value})}>
                  <option value="" disabled>Categoria</option>
                  <option value="Bolos">Bolos</option>
                  <option value="Doces">Doces</option>
                  <option value="Pães">Pães</option>
                  <option value="Salgados">Salgados</option>
                  <option value="Bebidas">Bebidas</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative flex items-center">
                    <input type="number" step="0.01" placeholder="Valor Base" required className={`${inputStyle} pr-10`} value={produto.oldPrice} onChange={(e) => setProduto({...produto, oldPrice: e.target.value, price: e.target.value})} />
                    <span className="absolute right-5 font-black opacity-40">$</span>
                  </div>
                  <div className="relative flex items-center">
                    <input type="number" placeholder="% Promo" className={`${inputStyle} pr-10`} value={porcentagem} onChange={(e) => setPorcentagem(e.target.value)} />
                    <Percent size={16} className="absolute right-5 opacity-40" />
                  </div>
                </div>

                {precoFinalCalculado && (
                  <div className={`p-4 rounded-2xl text-center font-black animate-pulse ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                    NOVO VALOR: R$ {precoFinalCalculado}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input type="number" step="0.1" max="5" placeholder="Estrelas" className={inputStyle} value={produto.rating} onChange={(e) => setProduto({...produto, rating: e.target.value})} />
                  <input type="text" placeholder="URL da Foto" required className={inputStyle} value={produto.image} onChange={(e) => setProduto({...produto, image: e.target.value})} />
                </div>

                <textarea placeholder="Descrição..." rows="2" className={`${inputStyle} resize-none`} value={produto.description} onChange={(e) => setProduto({...produto, description: e.target.value})} />

                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className={`flex-1 font-black py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-tighter text-lg ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}>
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />} 
                    {editandoId ? 'Atualizar' : 'Salvar'}
                  </button>
                  {editandoId && <button type="button" onClick={limparFormulario} className="px-6 font-black rounded-2xl bg-zinc-500 text-white uppercase shadow-lg">X</button>}
                </div>
              </form>
            </div>

            {/* Lista de Itens */}
            <div className="flex flex-col h-full lg:overflow-hidden pb-10 lg:pb-0">
              <h3 className={`text-xl font-black uppercase tracking-widest opacity-50 mb-6 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                Itens ({meusProdutos.length})
              </h3>
              
              <div className="flex-1 space-y-4 lg:overflow-y-auto pr-2 scrollbar-hide pb-20">
                {meusProdutos.map(item => (
                  <div key={item.id} className={`flex items-center justify-between p-4 rounded-[2rem] border transition-all ${
                    darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20 shadow-md'
                  }`}>
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                      <div>
                        <p className={`text-[10px] font-black uppercase ${darkMode ? 'text-white/40' : 'text-[#bc232d]/60'}`}>{item.category}</p>
                        <h4 className={`font-bold leading-tight truncate ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-sm ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>R$ {item.price}</span>
                          {item.oldPrice && item.oldPrice !== item.price && <span className="text-[10px] line-through opacity-40 italic font-bold">R$ {item.oldPrice}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => prepararEdicao(item)} className="p-3 bg-white/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => deletarProduto(item.id)} className="p-3 bg-white/20 rounded-xl hover:bg-red-600 hover:text-white transition-all text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}