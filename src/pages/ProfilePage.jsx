import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Calendar, LogOut, 
  UtensilsCrossed, MapPinned, Info, Pencil, Check, X, LogIn, Phone
} from 'lucide-react';
import Sidebar from '../components/SideBar';

const scrollbarHideStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none !important;
  }
  .hide-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }
`;

const Toast = ({ message, show, onClose, darkMode }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 400);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-colors duration-500 ${
        darkMode 
        ? 'bg-zinc-800 border-white/10 text-white' 
        : 'bg-[#bc232d] border-white/20 text-white'
      }`}>
        <div className="bg-white/20 p-1.5 rounded-full">
          <Check size={16} className="text-white" />
        </div>
        <span className="font-bold uppercase tracking-tighter text-sm">{message}</span>
      </div>
    </div>
  );
};

const GlobalLoading = ({ darkMode }) => (
  <div className={`flex flex-col items-center justify-center h-[100dvh] w-full animate-in fade-in duration-500 ${
    darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'
  }`}>
    <div className="animate-spin mb-4">
      <UtensilsCrossed size={40} />
    </div>
    <p className="font-black uppercase tracking-widest text-xs">Carregando Perfil...</p>
  </div>
);

export default function ProfilePage() {
  const { user, logout, darkMode } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "profiles", user.uid)).then(s => {
        if (s.exists()) {
          setData(s.data());
          setEditedData(s.data());
        }
        setTimeout(() => setLoading(false), 400);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

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
      showNotification("Perfil atualizado! 🍰");
    } catch (error) {
      console.error(error);
      showNotification("Erro ao salvar. ❌");
    }
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const handleChange = (e, field, subfield = null) => {
    const value = e.target.value;
    
    const finalValue = field === 'phone' ? value.replace(/\D/g, "") : value;

    if (subfield) {
      setEditedData({
        ...editedData,
        [field]: { ...editedData[field], [subfield]: finalValue }
      });
    } else {
      setEditedData({ ...editedData, [field]: finalValue });
    }
  };

  const inputStyle = `w-full border rounded-xl p-2 font-bold outline-none transition-all ${
    darkMode 
    ? "bg-white/5 border-white/10 text-white focus:bg-white/10" 
    : "bg-white/20 border-white/30 text-[#bc232d] focus:bg-white/40"
  }`;

  if (loading) return <GlobalLoading darkMode={darkMode} />;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'}`}>
      
      <style>{scrollbarHideStyle}</style>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        darkMode={darkMode} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto overflow-x-hidden order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 transition-colors duration-500 border-none outline-none hide-scrollbar ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        <div className="max-w-4xl mx-auto py-4">
          
          {!user ? (
            <div className="flex flex-col items-center justify-center h-[calc(100dvh-12rem)] text-center animate-in fade-in zoom-in-95 duration-500">
              <div className={`p-10 lg:p-16 rounded-[4rem] shadow-2xl border backdrop-blur-md w-full max-w-lg transition-all ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/30'
              }`}>
                <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-white/10 text-white' : 'bg-[#bc232d]/10 text-[#bc232d]'
                }`}>
                  <User size={40} />
                </div>

                <h2 className={`text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tighter ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  Login Necessário
                </h2>
                
                <p className={`mb-10 font-bold opacity-60 uppercase text-xs tracking-widest ${
                  darkMode ? 'text-white' : 'text-[#bc232d]'
                }`}>
                  Você precisa estar logado para acessar seu perfil.
                </p>

                <button 
                  onClick={() => navigate('/login')} 
                  className={`w-full flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-black shadow-xl hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest ${
                    darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                  }`}
                >
                  <LogIn size={22} /> Fazer Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-10 relative">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all ${
                    darkMode ? "bg-white text-zinc-900" : "bg-[#bc232d] text-white"
                  }`}>
                    <Pencil size={18} /> EDITAR PERFIL
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="bg-green-600 text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all"><Check size={24}/></button>
                    <button onClick={handleCancel} className="bg-[#bc232d] text-white p-3 rounded-2xl shadow-lg hover:scale-105 transition-all"><X size={24}/></button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-8">
                <section className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/30'} backdrop-blur-xl rounded-[3rem] p-8 lg:p-12 shadow-2xl border flex flex-col items-center text-center transition-colors`}>
                  <div className={`p-8 rounded-full shadow-2xl mb-6 relative transition-colors ${darkMode ? 'bg-zinc-800 text-white' : 'bg-[#bc232d] text-white'}`}>
                    <User size={70} />
                  </div>
                  {isEditing ? (
                    <input type="text" className={`${inputStyle} text-center text-2xl lg:text-3xl uppercase`} value={editedData.name} onChange={(e) => handleChange(e, 'name')} />
                  ) : (
                    <h1 className={`text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                      {data?.name || 'Cliente Especial'}
                    </h1>
                  )}
                  <p className={`font-bold text-sm lowercase mt-2 opacity-60 ${darkMode ? 'text-white/60' : 'text-[#bc232d]'}`}>
                    {user?.email}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DADOS PESSOAIS */}
                  <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-white/20'} backdrop-blur-md p-8 rounded-[3rem] border shadow-xl transition-colors`}>
                    <h3 className={`font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2 ${darkMode ? 'text-white/40' : 'text-[#bc232d]'}`}>
                      <Info size={16} /> Dados Pessoais
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Aniversário</label>
                        {isEditing ? (
                          <input type="date" className={inputStyle} value={editedData.birthday} onChange={(e) => handleChange(e, 'birthday')} />
                        ) : (
                          <div className={`flex items-center gap-3 font-bold text-lg ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                            <Calendar size={20} /> {data?.birthday || '---'}
                          </div>
                        )}
                      </div>

                      {/*TELEFONE */}
                      <div>
                        <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>WhatsApp / Telefone</label>
                        {isEditing ? (
                          <input 
                            type="tel" 
                            className={inputStyle} 
                            placeholder="Ex: 81988887777"
                            value={editedData.phone || ''} 
                            onChange={(e) => handleChange(e, 'phone')} 
                          />
                        ) : (
                          <div className={`flex items-center gap-3 font-bold text-lg ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                            <Phone size={20} /> {data?.phone || '---'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* LOCALIZAÇÃO */}
                  <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-white/20'} backdrop-blur-md p-8 rounded-[3rem] border shadow-xl transition-colors`}>
                    <h3 className={`font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2 ${darkMode ? 'text-white/40' : 'text-[#bc232d]'}`}>
                      <MapPinned size={16} /> Localização
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Cidade</label>
                        {isEditing ? (
                          <input type="text" className={inputStyle} value={editedData.address.city} onChange={(e) => handleChange(e, 'address', 'city')} />
                        ) : (
                          <p className={`font-black uppercase ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{data?.address?.city || '---'}</p>
                        )}
                      </div>
                      <div>
                        <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Estado</label>
                        {isEditing ? (
                          <input type="text" maxLength="2" className={inputStyle} value={editedData.address.state} onChange={(e) => handleChange(e, 'address', 'state')} />
                        ) : (
                          <p className={`font-black uppercase ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{data?.address?.state || '---'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ENDEREÇO COMPLETO */}
                  <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-white/20'} backdrop-blur-md p-8 rounded-[3rem] border shadow-xl md:col-span-2 transition-colors`}>
                    <h3 className={`font-black uppercase text-xs tracking-[0.2em] mb-6 ${darkMode ? 'text-white/40' : 'text-[#bc232d]'}`}>Endereço de Entrega</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Rua</label>
                          {isEditing ? (
                            <input type="text" className={inputStyle} value={editedData.address.street} onChange={(e) => handleChange(e, 'address', 'street')} />
                          ) : (
                            <p className={`text-lg font-black uppercase ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{data?.address?.street || '---'}</p>
                          )}
                        </div>
                        <div>
                          <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Número</label>
                          {isEditing ? (
                            <input type="text" className={inputStyle} value={editedData.address.number} onChange={(e) => handleChange(e, 'address', 'number')} />
                          ) : (
                            <p className={`font-bold uppercase ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{data?.address?.number || '---'}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Bairro</label>
                          {isEditing ? (
                            <input type="text" className={inputStyle} value={editedData.address.neighborhood} onChange={(e) => handleChange(e, 'address', 'neighborhood')} />
                          ) : (
                            <p className={`font-bold uppercase ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{data?.address?.neighborhood || '---'}</p>
                          )}
                        </div>
                        <div>
                          <label className={`text-[10px] font-black uppercase block mb-1 opacity-40 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>CEP</label>
                          {isEditing ? (
                            <input type="text" className={inputStyle} value={editedData.address.cep} onChange={(e) => handleChange(e, 'address', 'cep')} />
                          ) : (
                            <p className={`font-black ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>{data?.address?.cep || '---'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <button onClick={handleSignOut} className={`w-full mt-4 font-black py-6 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-2xl transition-all ${
                    darkMode ? "bg-white text-zinc-900 hover:bg-zinc-200" : "bg-[#bc232d] text-white hover:bg-[#a01d25]"
                  }`}>
                    <LogOut size={24} /> Encerrar Sessão
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}