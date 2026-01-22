
import React, { useState } from 'react';
import { Anchor, Ship, Skull, Waves } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, shipName?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', shipName: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.username, isRegistering ? formData.shipName : undefined);
  };

  return (
    <div className="min-h-screen sea-gradient flex items-center justify-center p-4">
      <div className="max-w-md w-full wood-texture border-2 border-[#D4AF37] rounded-lg shadow-2xl p-8 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-[#D4AF37]/20 rounded-full mb-4 border border-[#D4AF37]/50">
            <Anchor className="w-12 h-12 text-[#D4AF37]" />
          </div>
          <h1 className="font-pirate text-6xl text-[#D4AF37] tracking-tighter">Seagram</h1>
          <p className="font-cinzel text-xs text-[#00A3A1] mt-2 tracking-widest uppercase italic">
            {isRegistering ? 'Arruolati nella Leggenda' : 'Ritorna sulla Rotta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#D4AF37] uppercase mb-1 ml-1">Nome Pirata</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#0c1c22] border border-[#00707c] rounded p-3 text-sm outline-none focus:border-[#D4AF37] transition-colors"
              placeholder="E.g. Jack_Sparrow"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] uppercase mb-1 ml-1">Nome Nave</label>
              <input 
                type="text" 
                className="w-full bg-[#0c1c22] border border-[#00707c] rounded p-3 text-sm outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="E.g. Black Pearl"
                value={formData.shipName}
                onChange={e => setFormData({...formData, shipName: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#D4AF37] uppercase mb-1 ml-1">Codice Segreto</label>
            <input 
              required
              type="password" 
              className="w-full bg-[#0c1c22] border border-[#00707c] rounded p-3 text-sm outline-none focus:border-[#D4AF37] transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#D4AF37] text-[#2a1b12] font-cinzel font-bold py-3 rounded shadow-lg hover:bg-[#b8952e] transition-all transform active:scale-95"
          >
            {isRegistering ? 'Arruolati Ora' : 'Salpa Ora'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-[#00A3A1] hover:text-[#D4AF37] transition-colors underline underline-offset-4"
          >
            {isRegistering ? 'Hai già una ciurma? Accedi' : 'Non hai ancora una nave? Registrati'}
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-6 text-gray-600">
           <Skull className="w-5 h-5 opacity-50" />
           <Ship className="w-5 h-5 opacity-50" />
           <Waves className="w-5 h-5 opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default Login;
