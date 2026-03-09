import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from "../services/firebase"; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Layout, Save, Loader2, Image as ImageIcon, 
  Type, AlignLeft, UploadCloud, Link as LinkIcon, UtensilsCrossed 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";

const Toast = ({ message, show, onClose, darkMode }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-colors duration-500 ${
        darkMode 
        ? 'bg-zinc-800 border-white/10 text-white' 
        : 'bg-[#bc232d] border-white/20 text-white'
      }`}>
        <div className="bg-white/20 p-1.5 rounded-full">
          <UtensilsCrossed size={16} className="text-white" />
        </div>
        <span className="font-bold uppercase tracking-tighter text-sm">{message}</span>
      </div>
    </div>
  );
};

export default function BannerManager() {
  const navigate = useNavigate();
  const { darkMode, isAdmin } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const [banner, setBanner] = useState({
    title: 'A Arte de Assar Memórias',
    subtitle: 'Bolos artesanais para momentos inesquecíveis.',
    imageUrl: null 
  });

  useEffect(() => {
    if (!isAdmin) navigate('/');
    carregarBanner();
  }, [isAdmin, navigate]);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
  };

  const carregarBanner = async () => {
    try {
      const docRef = doc(db, "settings", "mainBanner");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBanner(docSnap.data());
      }
    } catch (e) {
      console.error("Erro ao carregar banner:", e);
    } finally {
      setFetching(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification("Por favor, selecione uma imagem! ❌");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `banners/mainBanner_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setBanner(prev => ({ ...prev, imageUrl: url }));
      showNotification("Imagem carregada com sucesso! 📷");
    } catch (error) {
      showNotification("Erro no upload da imagem ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "mainBanner"), banner);
      showNotification("Banner atualizado com sucesso! ✨");
    } catch (error) {
      showNotification("Erro ao salvar o banner ❌");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `w-full border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#bc232d] transition-all ${
    darkMode ? 'bg-white/10 text-white' : 'bg-white/50 text-[#bc232d] shadow-inner'
  }`;

  if (fetching) return (
    <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'}`}>
       <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      <Sidebar />

      <Toast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
        darkMode={darkMode}
      />

      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 order-1 lg:order-2 shadow-2xl h-full overflow-y-auto transition-colors duration-500 ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-10 uppercase tracking-tighter flex items-center gap-4">
            <Layout size={40} /> Gestão do Banner
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <Type size={14}/> Título Principal
                </label>
                <input 
                  type="text" 
                  className={inputStyle} 
                  value={banner.title} 
                  onChange={e => setBanner({...banner, title: e.target.value})} 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <AlignLeft size={14}/> Descrição
                </label>
                <textarea 
                  rows="3"
                  className={`${inputStyle} resize-none`} 
                  value={banner.subtitle} 
                  onChange={e => setBanner({...banner, subtitle: e.target.value})} 
                />
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-[2rem] border border-dashed border-white/20">
                <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <ImageIcon size={14}/> Imagem do Banner
                </label>

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold uppercase text-xs transition-all ${
                    darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-[#bc232d]/10 hover:bg-[#bc232d]/20 text-[#bc232d]'
                  }`}
                >
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                  {uploading ? "Enviando..." : "Selecionar Ficheiro"}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                  <span className="text-[10px] font-black opacity-30">OU</span>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Colar URL da imagem"
                    className={`${inputStyle} pl-12`} 
                    value={banner.imageUrl || ''} 
                    onChange={e => setBanner({...banner, imageUrl: e.target.value})} 
                  />
                  <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || uploading}
                className={`font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50 ${
                  darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />} 
                Salvar Alterações
              </button>
            </form>

            <div className="flex flex-col gap-4">
               <p className="text-xs font-black uppercase tracking-widest opacity-40 text-center">Pré-visualização</p>
               <section className={`${darkMode ? 'bg-zinc-800' : 'bg-[#e44444]'} rounded-[2.5rem] p-8 flex flex-col items-center relative h-80 shadow-2xl overflow-hidden justify-center text-center transition-colors duration-500`}>
                  {banner.imageUrl ? (
                    <img 
                      src={banner.imageUrl} 
                      alt="Preview" 
                      className="absolute -left-10 -top-4 w-48 h-48 object-contain drop-shadow-2xl opacity-20 lg:opacity-100 lg:relative lg:left-0 lg:top-0 lg:w-56 lg:mb-4 animate-in zoom-in duration-700" 
                    />
                  ) : (
                    <div className="w-48 h-48 mb-4 flex items-center justify-center border-2 border-dashed border-white/20 rounded-full">
                      <ImageIcon className="text-white/20" size={48} />
                    </div>
                  )}
                  <div className="text-white z-10">
                    <h1 className="text-2xl font-black uppercase leading-tight mb-2 tracking-tighter">{banner.title}</h1>
                    <p className="text-xs font-medium opacity-80 uppercase tracking-widest">{banner.subtitle}</p>
                  </div>
               </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}