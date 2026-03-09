import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Users, Mail, Phone, MapPin, Calendar, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';

export default function CustomersManager() {
  const { darkMode, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) navigate('/');
    fetchCustomers();
  }, [isAdmin, navigate]);

  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, "profiles"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(list);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={`flex flex-col items-center justify-center h-screen w-full ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#bc232d] text-white'}`}>
      <UtensilsCrossed size={40} className="animate-spin mb-4" />
      <p className="font-black uppercase tracking-widest text-xs">Carregando Clientes...</p>
    </div>
  );

  return (
    <div className={`flex flex-col lg:flex-row h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-[#bc232d]'}`}>
      <Sidebar />
      <main className={`flex-1 lg:rounded-l-[5rem] p-6 lg:p-12 overflow-y-auto order-1 lg:order-2 shadow-2xl h-full transition-colors duration-500 pb-32 lg:pb-12 ${
        darkMode ? 'bg-zinc-900 text-white' : 'bg-[#f4a28c] text-[#bc232d]'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black mb-10 uppercase tracking-tighter flex items-center gap-4">
            <Users size={40} /> Gestão de Clientes ({customers.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className={`p-6 rounded-[2.5rem] border backdrop-blur-md transition-all ${
                darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/40 border-white/20 text-[#bc232d]'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#bc232d] text-white flex items-center justify-center font-black text-xl">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-lg leading-tight">{customer.name}</h3>
                    <p className="text-[10px] font-bold opacity-60 uppercase">Cliente desde {new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <Mail size={16} /> {customer.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-80">
                    <Phone size={16} /> {customer.phone}
                  </div>
                  {customer.address && (
                    <div className="flex items-start gap-3 text-sm opacity-80">
                      <MapPin size={16} className="mt-1 flex-shrink-0" />
                      <span>{customer.address.street}, {customer.address.number} - {customer.address.neighborhood}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}