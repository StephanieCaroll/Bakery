import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, MapPin, Calendar, LogOut, 
  Home, Heart, ShoppingCart, Settings, UtensilsCrossed, 
  Mail, MapPinned, Info, Pencil, Check, X
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "profiles", user.uid)).then(s => {
        if (s.exists()) {
          setData(s.data());
          setEditedData(s.data());
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "profiles", user.uid);
      await updateDoc(docRef, editedData);
      setData(editedData);
      setIsEditing(false);
      alert("Perfil atualizado com sucesso! 🍰");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar as alterações.");
    }
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const handleChange = (e, field, subfield = null) => {
    if (subfield) {
      setEditedData({
        ...editedData,
        [field]: { ...editedData[field], [subfield]: e.target.value }
      });
    } else {
      setEditedData({ ...editedData, [field]: e.target.value });
    }
  };

  const inputStyle = "w-full bg-white/20 border border-white/30 rounded-xl p-2 text-[#bc232d] font-bold outline-none focus:bg-white/40 transition-all";

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#bc232d] font-sans overflow-hidden">
      
      {/* SIDEBAR / MENU INFERIOR */}
      <aside className="w-full lg:w-24 h-auto lg:h-full bg-[#bc232d] flex lg:flex-col items-center pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,1.5rem))] lg:py-12 justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10 px-6 lg:px-0 z-50">
        <div className="flex lg:flex-col items-center gap-6 lg:gap-14 w-full justify-around lg:justify-start">
          <div className="hidden lg:flex bg-white p-3 rounded-full text-[#bc232d] shadow-lg cursor-pointer" onClick={() => navigate('/')}>
            <UtensilsCrossed size={32} />
          </div>
          <nav className="flex lg:flex-col gap-8 lg:gap-12 text-white/50 w-full justify-around lg:items-center">
            <Home className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/')} />
            <User className="text-white" size={28} />
            <Heart className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/favoritos')} />
            <ShoppingCart className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/carrinho')} />
            <Settings className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/configuracoes')} />
          </nav>
        </div>
        {user && <LogOut className="text-white/50 cursor-pointer hover:text-white hidden lg:block" size={28} onClick={handleSignOut} />}
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 bg-[#f4a28c] lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 no-scrollbar">
        <div className="max-w-4xl mx-auto py-4">
          <div className="flex justify-between items-center mb-10">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#bc232d] font-black uppercase tracking-widest text-sm">
              <ArrowLeft size={24} /> Voltar
            </button>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#bc232d] text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all">
                <Pencil size={18} /> EDITAR PERFIL
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleSave} className="bg-green-600 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all"><Check size={24}/></button>
                <button onClick={handleCancel} className="bg-[#bc232d] text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all"><X size={24}/></button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#bc232d]">
              <div className="animate-spin mb-4"><UtensilsCrossed size={40} /></div>
              <p className="font-black uppercase tracking-widest">Carregando...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <section className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-white/30 flex flex-col items-center text-center">
                <div className="bg-[#bc232d] p-8 rounded-full text-white shadow-2xl mb-6 relative">
                  <User size={70} />
                </div>
                {isEditing ? (
                  <input type="text" className={`${inputStyle} text-center text-2xl lg:text-3xl uppercase`} value={editedData.name} onChange={(e) => handleChange(e, 'name')} />
                ) : (
                  <h1 className="text-4xl lg:text-5xl font-black text-[#bc232d] uppercase tracking-tighter mb-2">{data?.name || 'Cliente Especial'}</h1>
                )}
                <p className="text-[#bc232d] font-bold text-sm lowercase mt-2 opacity-60">{user?.email}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 shadow-xl">
                  <h3 className="text-[#bc232d] font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2"><Info size={16} /> Dados Pessoais</h3>
                  <div>
                    <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">Aniversário</label>
                    {isEditing ? (
                      <input type="date" className={inputStyle} value={editedData.birthday} onChange={(e) => handleChange(e, 'birthday')} />
                    ) : (
                      <div className="flex items-center gap-3 text-[#bc232d] font-bold text-lg"><Calendar size={20} /> {data?.birthday || '---'}</div>
                    )}
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 shadow-xl">
                  <h3 className="text-[#bc232d] font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2"><MapPinned size={16} /> Localização</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">Cidade</label>
                      {isEditing ? (
                        <input type="text" className={inputStyle} value={editedData.address.city} onChange={(e) => handleChange(e, 'address', 'city')} />
                      ) : (
                        <p className="font-black text-[#bc232d] uppercase">{data?.address?.city || '---'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">Estado</label>
                      {isEditing ? (
                        <input type="text" maxLength="2" className={inputStyle} value={editedData.address.state} onChange={(e) => handleChange(e, 'address', 'state')} />
                      ) : (
                        <p className="font-black text-[#bc232d] uppercase">{data?.address?.state || '---'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 shadow-xl md:col-span-2">
                  <h3 className="text-[#bc232d] font-black uppercase text-xs tracking-[0.2em] mb-6">Endereço de Entrega</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">Rua</label>
                        {isEditing ? (
                          <input type="text" className={inputStyle} value={editedData.address.street} onChange={(e) => handleChange(e, 'address', 'street')} />
                        ) : (
                          <p className="text-lg font-black text-[#bc232d] uppercase">{data?.address?.street || '---'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">Número</label>
                        {isEditing ? (
                          <input type="text" className={inputStyle} value={editedData.address.number} onChange={(e) => handleChange(e, 'address', 'number')} />
                        ) : (
                          <p className="font-bold text-[#bc232d] uppercase">{data?.address?.number || '---'}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">Bairro</label>
                        {isEditing ? (
                          <input type="text" className={inputStyle} value={editedData.address.neighborhood} onChange={(e) => handleChange(e, 'address', 'neighborhood')} />
                        ) : (
                          <p className="font-bold text-[#bc232d] uppercase">{data?.address?.neighborhood || '---'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-[#bc232d]/40 uppercase block mb-1">CEP</label>
                        {isEditing ? (
                          <input type="text" className={inputStyle} value={editedData.address.cep} onChange={(e) => handleChange(e, 'address', 'cep')} />
                        ) : (
                          <p className="font-black text-[#bc232d]">{data?.address?.cep || '---'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!isEditing && (
                <button onClick={handleSignOut} className="w-full mt-4 bg-[#bc232d] text-white font-black py-6 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-2xl hover:bg-[#a01d25] transition-all">
                  <LogOut size={24} /> Encerrar Sessão
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}