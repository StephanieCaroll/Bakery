import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Moon, UtensilsCrossed, LogOut,
  HelpCircle, ExternalLink, ChevronRight, MapPin, 
  Clock, CreditCard, Receipt, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

const GlobalLoading = ({ darkMode }) => (
  <div className={`flex flex-col items-center justify-center h-[100dvh] w-full animate-in fade-in duration-500 ${
    darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'
  }`}>
    <div className="animate-spin mb-4">
      <UtensilsCrossed size={40} />
    </div>
    <p className="font-black uppercase tracking-widest text-xs">Configurações...</p>
  </div>
);

const InfoModal = ({ isOpen, onClose, title, content, darkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-md p-8 rounded-[3rem] shadow-2xl border transition-colors duration-500 ${
        darkMode ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-[#bc232d]/10 text-[#bc232d]'
      }`}>
        <div className="flex justify-between items-start mb-6">
          <h4 className="text-2xl font-black uppercase tracking-tighter">{title}</h4>
          <button onClick={onClose} className="p-2 hover:opacity-50 transition"><X size={24} /></button>
        </div>
        <div className={`text-sm font-bold leading-relaxed opacity-80 mb-8`}>{content}</div>
        <button 
          onClick={onClose}
          className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 ${
            darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
          }`}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, darkMode, setDarkMode } = useAuth();

  const [newsletter, setNewsletter] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: "", content: "" });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openInfo = (title, content) => setModal({ open: true, title, content });

  const Toggle = ({ active, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-green-500' : 'bg-gray-400'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
    </button>
  );

  if (isLoading) return <GlobalLoading darkMode={darkMode} />;

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'}`}>
      
      <style>{scrollbarHideStyle}</style>

      <InfoModal 
        isOpen={modal.open} 
        title={modal.title} 
        content={modal.content} 
        darkMode={darkMode} 
        onClose={() => setModal({ ...modal, open: false })} 
      />

      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto overflow-x-hidden order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 hide-scrollbar transition-colors duration-500 border-none outline-none ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        <div className="max-w-2xl mx-auto">
          <h2 className={`text-4xl font-black mb-10 uppercase tracking-tighter text-center ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Configurações</h2>

          <div className="flex flex-col gap-8 pb-32">
            
            <section className="space-y-4">
              <h3 className={`${darkMode ? 'text-white/40' : 'text-[#bc232d]/60'} font-black text-xs uppercase tracking-[0.2em] px-4`}>Personalização</h3>
              <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white/20'} backdrop-blur-md rounded-[2.5rem] border p-2`}>
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><Moon size={18} /></div>
                    <span className="font-bold text-sm uppercase">Modo Noturno</span>
                  </div>
                  <Toggle active={darkMode} onClick={() => setDarkMode(!darkMode)} />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><Receipt size={18} /></div>
                    <span className="font-bold text-sm uppercase">Newsletter no Email</span>
                  </div>
                  <Toggle active={newsletter} onClick={() => setNewsletter(!newsletter)} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className={`${darkMode ? 'text-white/40' : 'text-[#bc232d]/60'} font-black text-xs uppercase tracking-[0.2em] px-4`}>Guia da Confeitaria</h3>
              <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white/20'} backdrop-blur-md rounded-[2.5rem] border p-2`}>
                <button 
                  onClick={() => openInfo("Locais de Entrega", "Realizamos entregas em toda a Região Metropolitana do Recife, Olinda e Jaboatão dos Guararapes.")} 
                  className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/10 transition-all rounded-t-[2rem]"
                >
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><MapPin size={18} /></div>
                    <span className="font-bold text-sm uppercase">Onde entregamos?</span>
                  </div>
                  <ChevronRight size={18} className={darkMode ? 'text-white/20' : 'text-[#bc232d]/40'} />
                </button>
                <button 
                  onClick={() => openInfo("Nossos Horários", "Produção artesanal: Segunda a Sexta, das 08h às 18h.")} 
                  className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/10 transition-all"
                >
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><Clock size={18} /></div>
                    <span className="font-bold text-sm uppercase">Horários de Forno</span>
                  </div>
                  <ChevronRight size={18} className={darkMode ? 'text-white/20' : 'text-[#bc232d]/40'} />
                </button>
                <button 
                  onClick={() => openInfo("Pagamentos", "Aceitamos Pix (com 5% de desconto), Cartões de Crédito e Débito.")} 
                  className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-all rounded-b-[2rem]"
                >
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><CreditCard size={18} /></div>
                    <span className="font-bold text-sm uppercase">Como pagar?</span>
                  </div>
                  <ChevronRight size={18} className={darkMode ? 'text-white/20' : 'text-[#bc232d]/40'} />
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className={`${darkMode ? 'text-white/40' : 'text-[#bc232d]/60'} font-black text-xs uppercase tracking-[0.2em] px-4`}>Suporte Direto</h3>
              <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white/20'} backdrop-blur-md rounded-[2.5rem] border p-2`}>
                <a href="https://wa.me/5581999999999" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/10 transition-all rounded-t-[2rem]">
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className="bg-green-600 p-2 rounded-xl text-white"><HelpCircle size={18} /></div>
                    <span className="font-bold text-sm uppercase">Pedir pelo WhatsApp</span>
                  </div>
                  <ExternalLink size={16} className={darkMode ? 'text-white/20' : 'text-[#bc232d]/40'} />
                </a>
                <div className="p-4 space-y-4">
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Sugestões ou elogios..."
                    className={`w-full rounded-2xl p-4 font-bold text-sm outline-none transition-all h-24 ${
                      darkMode ? 'bg-white/10 text-white' : 'bg-white/20 text-[#bc232d]'
                    }`}
                  />
                  <button 
                    onClick={() => { setFeedbackSent(true); setTimeout(() => setFeedbackSent(false), 2000); }}
                    className={`w-full font-black py-4 rounded-2xl uppercase text-xs tracking-widest ${
                      darkMode ? 'bg-white text-zinc-900' : 'bg-[#bc232d] text-white'
                    }`}
                  >
                    {feedbackSent ? "Enviado!" : "Enviar Feedback"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}