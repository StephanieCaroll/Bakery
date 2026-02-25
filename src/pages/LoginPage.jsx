import React, { useState } from 'react';
import { auth, db } from "../services/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LogIn, UserPlus, Eye, EyeOff, MapPinned,
  UtensilsCrossed, CheckCircle2, AlertCircle, X, HelpCircle
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar"; 

// --- COMPONENTE DE ALERT PERSONALIZADO ---
const CustomAlert = ({ isOpen, onClose, title, message, type = 'success', darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-sm p-8 rounded-[3rem] shadow-2xl border transition-all animate-in zoom-in-95 duration-300 ${
        darkMode ? 'bg-zinc-900 border-white/10' : 'bg-[#f4a28c] border-white/20'
      }`}>
        <button onClick={onClose} className={`absolute right-6 top-6 opacity-40 hover:opacity-100 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-[2rem] mb-4 ${darkMode ? 'bg-white/10' : 'bg-white/40'}`}>
            {type === 'success' ? (
              <CheckCircle2 size={40} className="text-green-500" />
            ) : type === 'info' ? (
              <HelpCircle size={40} className="text-blue-500" />
            ) : (
              <AlertCircle size={40} className="text-red-500" />
            )}
          </div>
          
          <h3 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
            {title}
          </h3>
          <p className={`text-sm font-bold uppercase mb-8 opacity-70 ${darkMode ? 'text-white' : 'text-[#bc232d]'}`}>
            {message}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all ${
              darkMode ? 'bg-white text-zinc-950' : 'bg-[#bc232d] text-white'
            }`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const { user, logout, darkMode } = useAuth();
  const navigate = useNavigate();
  
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    name: '', cep: '', street: '', number: '', 
    complement: '', neighborhood: '', city: '', state: '', birthday: ''
  });

  const showAlert = (title, message, type = 'success') => {
    setAlert({ isOpen: true, title, message, type });
  };

  // --- FUNÇÃO ESQUECI MINHA SENHA ---
  const handleForgotPassword = async () => {
    if (!formData.email) {
      return showAlert("Atenção", "Digite seu e-mail no campo acima primeiro!", "error");
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      showAlert("E-mail Enviado", `Enviamos um link de recuperação para: ${formData.email}`, "info");
    } catch (err) {
      showAlert("Erro", "Não conseguimos enviar o e-mail. Verifique se o endereço está correto.", "error");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        return showAlert("Erro", "As senhas não conferem!", "error");
      }
      try {
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await setDoc(doc(db, "profiles", res.user.uid), {
          name: formData.name,
          email: formData.email,
          birthday: formData.birthday,
          address: {
            cep: formData.cep, street: formData.street, number: formData.number,
            complement: formData.complement, neighborhood: formData.neighborhood,
            city: formData.city, state: formData.state
          },
          createdAt: new Date().toISOString()
        });
        navigate('/');
      } catch (err) { 
        showAlert("Erro no Cadastro", "Verifique seus dados ou se o e-mail já existe.", "error"); 
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/');
      } catch (err) { 
        showAlert("Acesso Negado", "E-mail ou senha incorretos.", "error"); 
      }
    }
  };

  const inputStyle = `w-full p-4 rounded-2xl outline-none shadow-sm transition-colors ${
    darkMode 
    ? "bg-zinc-800/50 text-white placeholder-white/30 focus:bg-zinc-800" 
    : "bg-white/60 text-[#bc232d] placeholder-[#bc232d]/50 focus:bg-white/80"
  }`;

  return (
    <div className={`flex flex-col lg:flex-row h-screen font-sans overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'
    }`}>
      
      <CustomAlert 
        isOpen={alert.isOpen} 
        onClose={() => setAlert({...alert, isOpen: false})}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        darkMode={darkMode}
      />

      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto overflow-x-hidden order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 transition-colors duration-500 border-none outline-none hide-scrollbar ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        <div className="max-w-2xl mx-auto py-8">
          <div className={`backdrop-blur-xl p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border transition-colors duration-500 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/30'
          }`}>
            <h2 className="text-4xl font-black mb-8 text-center uppercase tracking-tighter">
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </h2>

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {isRegister && (
                <>
                  <div className={`flex flex-col gap-4 mb-4 border-b pb-6 ${darkMode ? 'border-white/10' : 'border-[#bc232d]/10'}`}>
                    <p className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                      <MapPinned size={14}/> Informações Pessoais
                    </p>
                    <input type="text" placeholder="Nome Completo" required className={inputStyle} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold ml-4 opacity-60">DATA DE NASCIMENTO</label>
                      <input type="date" required className={inputStyle} onChange={e => setFormData({...formData, birthday: e.target.value})} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mb-4">
                    <p className="font-black text-xs uppercase tracking-widest opacity-60">Endereço de Entrega</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="CEP" required className={inputStyle} onChange={e => setFormData({...formData, cep: e.target.value})} />
                      <input type="text" placeholder="Bairro" required className={inputStyle} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                      <input type="text" placeholder="Rua / Logradouro" required className={inputStyle} onChange={e => setFormData({...formData, street: e.target.value})} />
                      <input type="text" placeholder="Nº" required className={`${inputStyle} w-24`} onChange={e => setFormData({...formData, number: e.target.value})} />
                    </div>
                    <input type="text" placeholder="Complemento" className={inputStyle} onChange={e => setFormData({...formData, complement: e.target.value})} />
                  </div>
                </>
              )}

              <p className="font-black text-xs uppercase tracking-widest mt-4 opacity-60">Acesso à Conta</p>
              <input 
                type="email" 
                placeholder="E-mail" 
                required 
                className={inputStyle} 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
              
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  placeholder="Senha" 
                  required={!isRegister} 
                  className={inputStyle} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 opacity-30">
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>

              {!isRegister && (
                <div className="flex justify-end px-2">
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              {isRegister && (
                <div className="relative">
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    placeholder="Confirmar Senha" 
                    required 
                    className={inputStyle} 
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-4 opacity-30">
                    {showConfirmPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>
              )}

              <button type="submit" className={`font-black py-5 rounded-2xl mt-6 shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${darkMode ? 'bg-white text-zinc-950' : 'bg-[#bc232d] text-white'}`}>
                {isRegister ? <UserPlus size={22}/> : <LogIn size={22}/>}
                {isRegister ? 'Finalizar Cadastro' : 'Entrar Agora'}
              </button>
            </form>

            <p className="text-center mt-8 font-bold cursor-pointer hover:underline uppercase text-xs tracking-tighter opacity-60" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Já tem uma conta? Clique para Entrar' : 'Novo por aqui? Crie sua conta agora'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}