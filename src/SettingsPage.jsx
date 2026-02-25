import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Moon, Home, User, Heart, 
  ShoppingCart, Settings, UtensilsCrossed, LogOut,
  Trash2, MessageSquare, HelpCircle, 
  ExternalLink, ChevronRight, BellRing, MapPin, 
  Clock, CreditCard, Receipt, X
} from 'lucide-react';
import { useAuth } from './AuthContext';

// Componente de Modal Personalizado que respeita o Modo Escuro
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

  // Estados
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  // Estado para o Modal
  const [modal, setModal] = useState({ open: false, title: "", content: "" });

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

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'}`}>
      
      <InfoModal 
        isOpen={modal.open} 
        title={modal.title} 
        content={modal.content} 
        darkMode={darkMode} 
        onClose={() => setModal({ ...modal, open: false })} 
      />

      {/* SIDEBAR */}
      <aside className={`w-full lg:w-24 h-auto lg:h-full flex lg:flex-col items-center pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,1.5rem))] lg:py-12 justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r px-6 lg:px-0 z-50 transition-colors duration-500 ${
        darkMode ? 'bg-zinc-900 border-white/5' : 'bg-[#bc232d] border-white/10'
      }`}>
        <div className="flex lg:flex-col items-center gap-6 lg:gap-14 w-full justify-around lg:justify-start">
          <div className={`${darkMode ? 'bg-white text-zinc-900' : 'bg-white text-[#bc232d]'} hidden lg:flex p-3 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110`} onClick={() => navigate('/')}>
            <UtensilsCrossed size={32} />
          </div>
          <nav className="flex lg:flex-col gap-8 lg:gap-12 text-white/50 w-full justify-around lg:items-center">
            <Home className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/')} />
            <User className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/perfil')} />
            <Heart className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/favoritos')} />
            <ShoppingCart className="cursor-pointer hover:text-white transition-colors" size={28} onClick={() => navigate('/carrinho')} />
            <Settings className="text-white" size={28} />
          </nav>
        </div>
        {user && <LogOut className="text-white/50 cursor-pointer hover:text-white hidden lg:block" size={28} onClick={handleLogout} />}
      </aside>

      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 no-scrollbar transition-colors duration-500 ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        <div className="max-w-2xl mx-auto">
          <h2 className={`text-4xl font-black mb-10 uppercase tracking-tighter text-center ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>Configurações</h2>

          <div className="flex flex-col gap-8 pb-32">
            
            {/* PREFERÊNCIAS */}
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

            {/* INFO DA CONFEITARIA */}
            <section className="space-y-4">
              <h3 className={`${darkMode ? 'text-white/40' : 'text-[#bc232d]/60'} font-black text-xs uppercase tracking-[0.2em] px-4`}>Guia da Confeitaria</h3>
              <div className={`${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/30 border-white/20'} backdrop-blur-md rounded-[2.5rem] border p-2`}>
                <button 
                  onClick={() => openInfo("Locais de Entrega", "Realizamos entregas em toda a Região Metropolitana do Recife, Olinda e Jaboatão dos Guararapes. Taxa fixa de R$ 10,00 para pedidos acima de R$ 50,00.")} 
                  className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/10 transition-all rounded-t-[2rem]"
                >
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><MapPin size={18} /></div>
                    <span className="font-bold text-sm uppercase">Onde entregamos?</span>
                  </div>
                  <ChevronRight size={18} className={darkMode ? 'text-white/20' : 'text-[#bc232d]/40'} />
                </button>
                <button 
                  onClick={() => openInfo("Nossos Horários", "Produção artesanal: Segunda a Sexta, das 08h às 18h. Pedidos feitos após as 16h entram na agenda do dia seguinte. Fins de semana apenas eventos agendados.")} 
                  className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/10 transition-all"
                >
                  <div className={`flex items-center gap-4 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
                    <div className={`${darkMode ? 'bg-zinc-700' : 'bg-[#bc232d]'} p-2 rounded-xl text-white`}><Clock size={18} /></div>
                    <span className="font-bold text-sm uppercase">Horários de Forno</span>
                  </div>
                  <ChevronRight size={18} className={darkMode ? 'text-white/20' : 'text-[#bc232d]/40'} />
                </button>
                <button 
                  onClick={() => openInfo("Pagamentos", "Aceitamos Pix (com 5% de desconto), Cartões de Crédito (todas as bandeiras) e Débito. Não aceitamos dinheiro no ato da entrega por segurança.")} 
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

            {/* SUPORTE */}
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
                    placeholder="Sugestões ou elogios sobre nossos bolos..."
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