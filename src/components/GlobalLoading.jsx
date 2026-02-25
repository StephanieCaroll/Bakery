import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function GlobalLoading({ darkMode }) {
  return (
    <div className={`flex flex-col items-center justify-center h-full w-full animate-in fade-in duration-500 ${darkMode ? 'bg-zinc-950 text-white' : 'bg-[#f4a28c] text-[#bc232d]'}`}>
      <div className="animate-spin mb-4">
        <UtensilsCrossed size={40} />
      </div>
      <p className="font-black uppercase tracking-widest text-xs">Carregando...</p>
    </div>
  );
}