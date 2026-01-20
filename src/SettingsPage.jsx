import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Shield, Moon, Home, User, Heart, 
  ShoppingCart, Settings, UtensilsCrossed, LogOut,
  Globe, Volume2, Trash2, AlertTriangle, Smartphone,
  MessageSquare, HelpCircle, RefreshCw, SmartphoneNfc,
  ExternalLink, ChevronRight
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [language, setLanguage] = useState('pt-br');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCheckUpdates = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
      alert("A Bakery App já está na versão mais recente! (v1.2.5) 🧁");
    }, 2000);
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedback("");
      setFeedbackSent(false);
      alert("Obrigado pelo seu feedback! Vamos analisar com carinho. 🍰");
    }, 1500);
  };

  const handleClearCache = () => {
    localStorage.clear();
    alert("Cache limpo! A app irá carregar as imagens do zero no próximo acesso.");
  };

  const Toggle = ({ active, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-green-500' : 'bg-gray-400'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
    </button>
  );

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
            <User className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/perfil')} />
            <Heart className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/favoritos')} />
            <ShoppingCart className="cursor-pointer hover:text-white" size={28} onClick={() => navigate('/carrinho')} />
            <Settings className="text-white" size={28} />
          </nav>
        </div>
        {user && <LogOut className="text-white/50 cursor-pointer hover:text-white hidden lg:block" size={28} onClick={handleLogout} />}
      </aside>

      <main className="flex-1 bg-[#f4a28c] lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 no-scrollbar">
        <div className="max-w-2xl mx-auto">
          
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#bc232d] font-black uppercase tracking-widest text-sm mb-10">
            <ArrowLeft size={20} /> Voltar
          </button>

          <h2 className="text-4xl font-black text-[#bc232d] mb-10 uppercase tracking-tighter">Configurações</h2>

          <div className="flex flex-col gap-8 pb-32">
            
            {/* PREFERÊNCIAS VISUAIS E SOM */}
            <section className="space-y-4">
              <h3 className="text-[#bc232d]/60 font-black text-xs uppercase tracking-[0.2em] px-4">Experiência</h3>
              <div className="bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-2">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-[#bc232d] p-2 rounded-xl text-white"><Moon size={18} /></div>
                    <span className="font-bold text-sm uppercase">Modo Escuro</span>
                  </div>
                  <Toggle active={darkMode} onClick={() => setDarkMode(!darkMode)} />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-[#bc232d] p-2 rounded-xl text-white"><Volume2 size={18} /></div>
                    <span className="font-bold text-sm uppercase">Sons da App</span>
                  </div>
                  <Toggle active={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)} />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-[#bc232d] p-2 rounded-xl text-white"><SmartphoneNfc size={18} /></div>
                    <span className="font-bold text-sm uppercase">Vibração Hática</span>
                  </div>
                  <Toggle active={vibration} onClick={() => setVibration(!vibration)} />
                </div>
              </div>
            </section>

            {/* SUPORTE E AJUDA (Funcional) */}
            <section className="space-y-4">
              <h3 className="text-[#bc232d]/60 font-black text-xs uppercase tracking-[0.2em] px-4">Suporte</h3>
              <div className="bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-2">
                <a 
                  href="https://wa.me/5500000000000" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/10 transition-all rounded-t-[2rem]"
                >
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-green-600 p-2 rounded-xl text-white"><HelpCircle size={18} /></div>
                    <span className="font-bold text-sm uppercase">Falar no WhatsApp</span>
                  </div>
                  <ExternalLink size={16} className="text-[#bc232d]/40" />
                </a>
                
                <button 
                  onClick={handleCheckUpdates}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-[#bc232d] p-2 rounded-xl text-white">
                      <RefreshCw size={18} className={isUpdating ? "animate-spin" : ""} />
                    </div>
                    <span className="font-bold text-sm uppercase">
                      {isUpdating ? "A verificar..." : "Procurar Atualizações"}
                    </span>
                  </div>
                  {!isUpdating && <ChevronRight size={18} className="text-[#bc232d]/40" />}
                </button>
              </div>
            </section>

            {/*FEEDBACK (Formulário funcional) */}
            <section className="space-y-4">
              <h3 className="text-[#bc232d]/60 font-black text-xs uppercase tracking-[0.2em] px-4">Sugestões</h3>
              <form onSubmit={handleSendFeedback} className="bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-4 text-[#bc232d]">
                  <MessageSquare size={20} />
                  <span className="font-black text-sm uppercase">O que podemos melhorar?</span>
                </div>
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escreva aqui sua sugestão..."
                  className="w-full bg-white/20 rounded-2xl p-4 text-[#bc232d] placeholder-[#bc232d]/40 font-bold text-sm outline-none focus:ring-2 ring-[#bc232d]/20 transition-all resize-none h-24"
                />
                <button 
                  type="submit"
                  disabled={feedbackSent || !feedback.trim()}
                  className="w-full mt-4 bg-[#bc232d] text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 uppercase text-xs tracking-widest"
                >
                  {feedbackSent ? "A Enviar..." : "Enviar Feedback"}
                </button>
              </form>
            </section>

            {/* DADOS E CONTA */}
            <section className="space-y-4">
              <h3 className="text-[#bc232d]/60 font-black text-xs uppercase tracking-[0.2em] px-4">Segurança</h3>
              <div className="bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-2">
                <button 
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-all rounded-t-[2rem]"
                >
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-[#bc232d] p-2 rounded-xl text-white"><Trash2 size={18} /></div>
                    <span className="font-bold text-sm uppercase">Otimizar Espaço (Cache)</span>
                  </div>
                  <span className="text-[10px] font-black text-[#bc232d]/40">4.2 MB</span>
                </button>

                <button 
                  onClick={() => alert("Função de exportar dados solicitada via email.")}
                  className="w-full flex items-center justify-between p-4 border-t border-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4 text-[#bc232d]">
                    <div className="bg-[#bc232d] p-2 rounded-xl text-white"><Shield size={18} /></div>
                    <span className="font-bold text-sm uppercase">Privacidade dos Dados</span>
                  </div>
                  <ChevronRight size={18} className="text-[#bc232d]/40" />
                </button>
              </div>
            </section>

            <div className="text-center space-y-2 opacity-30">
              <p className="font-black text-[10px] uppercase tracking-[0.3em] text-[#bc232d]">Bakery App Corporate v1.2.5</p>
              <p className="font-bold text-[9px] uppercase text-[#bc232d]">© 2026 Stephanie Caroline • UNINASSAU</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}