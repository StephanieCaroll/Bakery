import React, { useState } from 'react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LogIn, UserPlus, Eye, EyeOff, MapPinned,
  Home, User, Heart, ShoppingCart, Settings, UtensilsCrossed, LogOut
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { user, logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#bc232d] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-24 h-20 lg:h-full bg-[#bc232d] flex lg:flex-col items-center py-4 lg:py-12 justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10 px-6 lg:px-0 z-50">
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
        {user && <LogOut className="text-white/50 cursor-pointer hover:text-white hidden lg:block" size={28} onClick={handleLogout} />}
      </aside>

      {/* Conteúdo Principal com Scroll Fixado */}
      <main className="flex-1 bg-[#f4a28c] lg:rounded-l-[5rem] overflow-y-auto order-1 lg:order-2 shadow-2xl h-full p-6 lg:p-12">
        <div className="max-w-2xl mx-auto py-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-[#bc232d] font-bold mb-8 hover:scale-105 transition outline-none"
          >
            <ArrowLeft size={20} /> VOLTAR AO MENU
          </button>

          <div className="bg-white/40 backdrop-blur-xl p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white/30">
            <h2 className="text-4xl font-black text-[#bc232d] mb-8 text-center uppercase tracking-tighter">
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </h2>

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {isRegister && (
                <>
                  <div className="flex flex-col gap-4 mb-4 border-b border-[#bc232d]/10 pb-6">
                    <p className="text-[#bc232d] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                      <MapPinned size={14}/> Informações Pessoais
                    </p>
                    <input 
                      type="text" placeholder="Nome Completo" required 
                      className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d] placeholder-[#bc232d]/50 shadow-sm"
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#bc232d] ml-4">DATA DE NASCIMENTO</label>
                      <input 
                        type="date" required 
                        className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, birthday: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mb-4">
                    <p className="text-[#bc232d] font-black text-xs uppercase tracking-widest">Endereço de Entrega</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="CEP" required 
                        className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, cep: e.target.value})} 
                      />
                      <input 
                        type="text" placeholder="Bairro" required 
                        className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, neighborhood: e.target.value})} 
                      />
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" placeholder="Rua / Logradouro" required 
                        className="flex-1 p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, street: e.target.value})} 
                      />
                      <input 
                        type="text" placeholder="Nº" required 
                        className="w-24 p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, number: e.target.value})} 
                      />
                    </div>
                    <input 
                      type="text" placeholder="Complemento (Apto, Bloco, Referência)" 
                      className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                      onChange={e => setFormData({...formData, complement: e.target.value})} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Cidade" required 
                        className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, city: e.target.value})} 
                      />
                      <input 
                        type="text" placeholder="Estado (UF)" maxLength="2" required 
                        className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                        onChange={e => setFormData({...formData, state: e.target.value})} 
                      />
                    </div>
                  </div>
                </>
              )}

              <p className="text-[#bc232d] font-black text-xs uppercase tracking-widest mt-4">Acesso à Conta</p>
              <input 
                type="email" placeholder="E-mail" required 
                className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />

              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} placeholder="Senha" required 
                  className="w-full p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-[#bc232d]/50">
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>

              {isRegister && (
                <input 
                  type="password" placeholder="Confirmar Senha" required 
                  className="p-4 rounded-2xl bg-white/60 outline-none text-[#bc232d]"
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                />
              )}

              <button 
                type="submit" 
                className="bg-[#bc232d] text-white font-black py-5 rounded-2xl mt-6 shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {isRegister ? <UserPlus size={22}/> : <LogIn size={22}/>}
                {isRegister ? 'Finalizar Cadastro' : 'Entrar Agora'}
              </button>
            </form>

            <p 
              className="text-center mt-8 text-[#bc232d] font-bold cursor-pointer hover:underline uppercase text-xs tracking-tighter" 
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