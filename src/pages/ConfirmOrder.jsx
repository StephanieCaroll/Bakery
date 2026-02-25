import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function ConfirmOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    const processConfirmation = async () => {
      try {
        const orderRef = doc(db, "orders", orderId);
        const snap = await getDoc(orderRef);

        if (snap.exists()) {
          await updateDoc(orderRef, { 
            status: "Preparando", 
            confirmedAt: new Date()
          });
          setStatus('success');
          // Redireciona para o dashboard após 2 segundos
          setTimeout(() => navigate('/admin/orders'), 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    processConfirmation();
  }, [orderId, navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
          <h2 className="text-xl font-bold uppercase tracking-tighter">Confirmando Pedido no Sistema...</h2>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle className="text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-bold uppercase tracking-tighter">Pedido Confirmado!</h2>
          <p className="opacity-60 text-sm mt-2">O dashboard já foi atualizado para "Preparando".</p>
        </>
      )}
      {status === 'error' && (
        <p className="text-red-500 font-bold">Erro: Pedido não encontrado ou link inválido.</p>
      )}
    </div>
  );
}