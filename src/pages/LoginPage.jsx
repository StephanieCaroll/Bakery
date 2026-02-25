import React, { useState } from 'react';
import { auth, db } from "../services/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LogIn, UserPlus, Eye, EyeOff, MapPinned,
  LogOut, UtensilsCrossed
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar"; 

const scrollbarHideStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none !important;
  }
  .hide-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }
`;

export default function LoginPage() {
  const { user, logout, darkMode } = useAuth();
  const navigate = useNavigate();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    name: '', cep: '', street: '', number: '', 
    complement: '', neighborhood: '', city: '', state: '', birthday: ''
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) return alert("Senhas não conferem!");
      try {
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await setDoc(doc(db, "profiles", res.user.uid), {
          name: formData.name,
          email: formData.email,
          birthday: formData.birthday,
          address: {
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state
          },
          createdAt: new Date().toISOString()
        });
        navigate('/');
      } catch (err) { alert(err.message); }
    } else {
      try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/');
      } catch (err) { alert("E-mail ou senha incorretos."); }
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
  
      <style>{scrollbarHideStyle}</style>
      
      <Sidebar onLogoClick={() => navigate('/')} />

      <main className={`flex-1 lg:rounded-l-[5rem] overflow-y-auto overflow-x-hidden order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12 transition-colors duration-500 border-none outline-none hide-scrollbar ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        <div className="max-w-2xl mx-auto py-8">

          <div className={`backdrop-blur-xl p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border transition-colors duration-500 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/30'
          }`}>
            <h2 className={`text-4xl font-black mb-8 text-center uppercase tracking-tighter ${
              darkMode ? 'text-white' : 'text-[#bc232d]'
            }`}>
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </h2>

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {isRegister && (
                <>
                  <div className={`flex flex-col gap-4 mb-4 border-b pb-6 ${
                    darkMode ? 'border-white/10' : 'border-[#bc232d]/10'
                  }`}>
                    <p className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${
                      darkMode ? 'text-white/40' : 'text-[#bc232d]'
                    }`}>
                      <MapPinned size={14}/> Informações Pessoais
                    </p>

                     {/* DT Nascimento */}
                    <input 
                      type="text" placeholder="Nome Completo" required 
                      className={inputStyle}
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    
                    <div className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold ml-4 ${
                        darkMode ? 'text-white/40' : 'text-[#bc232d]'
                      }`}>DATA DE NASCIMENTO</label>
                      <input 
                        type="date" required 
                        className={inputStyle}
                        onChange={e => setFormData({...formData, birthday: e.target.value})} 
                      />
                    </div>
                  </div>

                {/* Endereço */}
                  <div className="flex flex-col gap-4 mb-4">
                    <p className={`font-black text-xs uppercase tracking-widest ${
                      darkMode ? 'text-white/40' : 'text-[#bc232d]'
                    }`}>Endereço de Entrega</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="CEP" required 
                        className={inputStyle}
                        onChange={e => setFormData({...formData, cep: e.target.value})} 
                      />
                      <input 
                        type="text" placeholder="Bairro" required 
                        className={inputStyle}
                        onChange={e => setFormData({...formData, neighborhood: e.target.value})} 
                      />
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" placeholder="Rua / Logradouro" required 
                        className={inputStyle}
                        onChange={e => setFormData({...formData, street: e.target.value})} 
                      />
                      <input 
                        type="text" placeholder="Nº" required 
                        className={`${inputStyle} w-24`}
                        onChange={e => setFormData({...formData, number: e.target.value})} 
                      />
                    </div>
                    <input 
                      type="text" placeholder="Complemento (Apto, Bloco, Referência)" 
                      className={inputStyle}
                      onChange={e => setFormData({...formData, complement: e.target.value})} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Cidade" required 
                        className={inputStyle}
                        onChange={e => setFormData({...formData, city: e.target.value})} 
                      />
                      <input 
                        type="text" placeholder="Estado (UF)" maxLength="2" required 
                        className={inputStyle}
                        onChange={e => setFormData({...formData, state: e.target.value})} 
                      />
                    </div>
                  </div>
                </>
              )}

              <p className={`font-black text-xs uppercase tracking-widest mt-4 ${
                darkMode ? 'text-white/40' : 'text-[#bc232d]'
              }`}>Acesso à Conta</p>
              
              <input 
                type="email" placeholder="E-mail" required 
                className={inputStyle}
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />

              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} placeholder="Senha" required 
                  className={inputStyle}
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute right-4 top-4 ${
                  darkMode ? 'text-white/20' : 'text-[#bc232d]/50'
                }`}>
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>

              {isRegister && (
                <input 
                  type="password" placeholder="Confirmar Senha" required 
                  className={inputStyle}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                />
              )}

              <button 
                type="submit" 
                className={`font-black py-5 rounded-2xl mt-6 shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
                  darkMode ? 'bg-white text-zinc-950' : 'bg-[#bc232d] text-white'
                }`}
              >
                {isRegister ? <UserPlus size={22}/> : <LogIn size={22}/>}
                {isRegister ? 'Finalizar Cadastro' : 'Entrar Agora'}
              </button>
            </form>

            <p 
              className={`text-center mt-8 font-bold cursor-pointer hover:underline uppercase text-xs tracking-tighter ${
                darkMode ? 'text-white/60' : 'text-[#bc232d]'
              }`} 
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Já tem uma conta? Clique para Entrar' : 'Novo por aqui? Crie sua conta agora'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}