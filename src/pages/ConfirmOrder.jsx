import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { CheckCircle, Loader2, ShieldCheck, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ConfirmOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useAuth();
  
  const [status, setStatus] = useState('checking_auth'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const ADMIN_EMAIL = "admin.bakery@system.com.br"; 

  const processConfirmation = async () => {
    setStatus('processing');
    try {
      const orderRef = doc(db, "orders", orderId);
      const snap = await getDoc(orderRef);

      if (snap.exists()) {
        await updateDoc(orderRef, { 
          status: "Preparando", 
          confirmedAt: new Date()
        });
        setStatus('success');
        setTimeout(() => navigate('/admin/orders'), 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.email === ADMIN_EMAIL) {
      processConfirmation();
    } else {
      setStatus('login_required');
    }
  }, [orderId]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (email !== ADMIN_EMAIL) {
      setLoginError("Este e-mail não tem permissão de administrador.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      processConfirmation();
    } catch (err) {
      setLoginError("Senha incorreta ou erro na autenticação.");
    }
  };

  return (
    <div className={`h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${
      darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'
    }`}>
      
      {(status === 'checking_auth' || status === 'processing') && (
        <div className="flex flex-col items-center animate-pulse">
          <Loader2 className="animate-spin text-white mb-4" size={50} />
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Validando Credenciais...</h2>
        </div>
      )}

      {status === 'login_required' && (
        <div className={`w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl border animate-in zoom-in-95 duration-500 ${
          darkMode ? 'bg-zinc-900 border-white/10' : 'bg-white/20 border-white/30 backdrop-blur-md'
        }`}>
          <div className="flex justify-center mb-6">
          
            <ShieldCheck size={50} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Área do Administrador</h2>
          <p className="text-xs font-bold opacity-70 mb-8 uppercase tracking-widest">Confirme sua identidade para preparar este pedido.</p>
          
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="E-mail do Admin"
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 outline-none focus:bg-white/20 transition-all placeholder:text-white/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Senha"
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 outline-none focus:bg-white/20 transition-all placeholder:text-white/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {loginError && (
              <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold justify-center mt-2">
                <AlertCircle size={14} /> {loginError}
              </div>
            )}

            <button type="submit" className={`mt-4 flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
              darkMode ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
            }`}>
              <LogIn size={20} /> Entrar e Confirmar
            </button>
          </form>
        </div>
      )}

      {status === 'success' && (
        <div className="animate-in fade-in duration-500">
          <CheckCircle className="text-green-400 mb-4 mx-auto" size={60} />
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Pedido em Preparo!</h2>
          <p className="opacity-70 mt-2 font-bold uppercase text-xs">Redirecionando para o painel...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="animate-in shake duration-500">
          <AlertCircle className="text-white mb-4 mx-auto" size={60} />
          <h2 className="text-xl font-black uppercase tracking-tighter">Pedido não encontrado ou expirado.</h2>
          <button onClick={() => navigate('/')} className="mt-8 underline font-bold uppercase text-xs">Voltar para a Loja</button>
        </div>
      )}

    </div>
  );
}