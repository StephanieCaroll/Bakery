import React, { useState, useEffect } from 'react';
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ArrowLeft, Save, Loader2, UtensilsCrossed, Trash2, Edit3, CheckCircle2, AlertCircle, Percent, Eye, X, Hash } from 'lucide-react';
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
  const [previewItem, setPreviewItem] = useState(null);

  const [porcentagem, setPorcentagem] = useState('');
  const [precoFinalCalculado, setPrecoFinalCalculado] = useState(null);

  const [produto, setProduto] = useState({
    name: '', price: '', oldPrice: '', rating: '', image: '', description: '', category: '', stock: ''
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
        rating: Number(produto.rating),
        stock: Number(produto.stock)
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
    setProduto({ ...item, oldPrice: item.oldPrice || item.price, stock: item.stock || '' });
    setPorcentagem('');
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setPorcentagem('');
    setProduto({ name: '', price: '', oldPrice: '', rating: '', image: '', description: '', category: '', stock: '' });
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
      
      {previewItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`relative w-full max-w-sm rounded-[3.5rem] p-8 shadow-2xl border transition-all ${
            darkMode ? 'bg-zinc-900 border-white/10' : 'bg-[#f4a28c] border-white/20'
          }`}>
            <button onClick={() => setPreviewItem(null)} className={`absolute right-6 top-6 opacity-40 hover:opacity-100 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <img src={previewItem.image} alt={previewItem.name} className="w-40 h-40 object-contain drop-shadow-2xl mb-6 hover:scale-105 transition-transform" />
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 opacity-60 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{previewItem.category}</p>
              <h3 className={`text-2xl font-black uppercase tracking-tighter mb-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{previewItem.name}</h3>
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-3xl font-black italic ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>R$ {previewItem.price}</span>
                {previewItem.oldPrice && Number(previewItem.oldPrice) > Number(previewItem.price) && (
                  <span className={`text-sm line-through italic font-bold ${darkMode ? 'text-white/40' : 'text-black/30'}`}>R$ {previewItem.oldPrice}</span>
                )}
              </div>
              <p className={`text-xs font-bold uppercase opacity-70 leading-relaxed ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{previewItem.description}</p>
              <div className={`mt-4 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-white/10 text-white' : 'bg-[#bc232d] text-white'}`}>
                Stock: {previewItem.stock || 0} unid.
              </div>
            </div>
          </div>
        </div>
      )}

      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 order-1 lg:order-2 shadow-2xl h-full transition-colors duration-500 border-none outline-none overflow-y-auto scrollbar-hide pb-32 lg:pb-12 ${
        darkMode ? 'bg-zinc-900' : 'bg-[#f4a28c]'
      }`}>
        
        <div className="max-w-6xl mx-auto flex flex-col py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            <div className={`flex flex-col h-auto ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/20'} backdrop-blur-md p-8 lg:p-10 rounded-[3rem]`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'}`}>
                  <UtensilsCrossed size={32} />
                </div>
                <h2 className={`text-2xl lg:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                  {editandoId ? 'Editar Item' : 'Cadastrar'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                <div className="grid grid-cols-2 gap-4">
                  <input type="number" step="0.1" max="5" placeholder="Estrelas" className={inputStyle} value={produto.rating} onChange={(e) => setProduto({...produto, rating: e.target.value})} />
                  <div className="relative flex items-center">
                    <input type="number" placeholder="Stock" required className={`${inputStyle} pr-10`} value={produto.stock} onChange={(e) => setProduto({...produto, stock: e.target.value})} />
                    <Hash size={16} className="absolute right-5 opacity-40" />
                  </div>
                </div>

                <input type="text" placeholder="URL da Foto" required className={inputStyle} value={produto.image} onChange={(e) => setProduto({...produto, image: e.target.value})} />
                
                <textarea placeholder="Descrição..." rows="3" className={`${inputStyle} resize-none`} value={produto.description} onChange={(e) => setProduto({...produto, description: e.target.value})} />

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={loading} className={`flex-1 font-black py-5 rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest text-lg ${
                    darkMode ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-[#bc232d] text-white hover:brightness-110'
                  }`}>
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />} 
                    {editandoId ? 'Atualizar' : 'Salvar'}
                  </button>
                  {editandoId && (
                    <button type="button" onClick={limparFormulario} className="px-8 font-black rounded-[2rem] bg-zinc-500 text-white uppercase shadow-lg hover:bg-zinc-600 transition-colors">
                      X
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Itens */}
            <div className="flex flex-col pb-20 lg:pb-0">
              <h3 className={`text-xl font-black uppercase tracking-widest opacity-50 mb-6 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                Itens ({meusProdutos.length})
              </h3>
              
              <div className="space-y-4 pr-2 scrollbar-hide">
                {meusProdutos.map(item => (
                  <div key={item.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[2rem] border transition-all gap-4 ${
                    darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/20 shadow-md'
                  }`}>
                    <div className="flex items-center gap-4 w-full overflow-hidden">
                      <img src={item.image} alt="" className="w-14 h-14 min-w-[56px] rounded-2xl object-cover shadow-lg" />
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-[9px] font-black uppercase ${darkMode ? 'text-white/40' : 'text-[#bc232d]/60'}`}>{item.category}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.stock <= 0 ? 'bg-red-500 text-white' : 'bg-green-500/20 text-green-500'}`}>
                            Stock: {item.stock || 0}
                          </span>
                        </div>
                        <h4 className={`font-bold leading-tight truncate text-sm ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-sm ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>R$ {item.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button onClick={() => setPreviewItem(item)} className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-[#bc232d]'}`}>
                        <Eye size={18} />
                      </button>
                      <button onClick={() => prepararEdicao(item)} className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deletarProduto(item.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
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