
import React, { useState } from 'react';
import { GUILD_MEMBERS } from '../constants';
import { Skull, Coins, Sword, ScrollText } from 'lucide-react';

const Guild: React.FC = () => {
  const [activeMember, setActiveMember] = useState(GUILD_MEMBERS[0]);

  return (
    <div className="animate-fadeIn pb-10">
      <header className="text-center mb-10">
        <div className="inline-block p-4 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] mb-4">
          <Skull className="w-12 h-12 text-[#D4AF37]" />
        </div>
        <h2 className="font-pirate text-5xl text-[#D4AF37] mb-2 tracking-widest uppercase">Ciurma Tocca Pelati</h2>
        <p className="font-cinzel text-sm text-[#00A3A1] tracking-[0.2em]">"Più Lisci della Chiglia, Più Forti delle Onde"</p>
      </header>

      {/* Guild Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-10 wood-texture p-4 border border-[#D4AF37]/40 rounded-lg shadow-inner">
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase">Tesoro Totale</p>
          <p className="font-pirate text-2xl text-[#D4AF37]">25.0M</p>
        </div>
        <div className="text-center border-x border-[#D4AF37]/20">
          <p className="text-[10px] text-gray-400 uppercase">Membri</p>
          <p className="font-pirate text-2xl text-[#D4AF37]">48</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase">Livello</p>
          <p className="font-pirate text-2xl text-[#D4AF37]">99</p>
        </div>
      </div>

      {/* Member Selection Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 px-1 scrollbar-hide">
        {GUILD_MEMBERS.map(member => (
          <button
            key={member.id}
            onClick={() => setActiveMember(member)}
            className={`flex-shrink-0 px-4 py-2 rounded font-cinzel text-xs transition-all ${
              activeMember.id === member.id 
                ? 'bg-[#D4AF37] text-[#2a1b12] shadow-lg scale-105' 
                : 'bg-[#1a2e35] text-gray-400 border border-[#00707c]/30 hover:border-[#00A3A1]'
            }`}
          >
            {member.name}
          </button>
        ))}
      </div>

      {/* Active Member Lore Card */}
      <div className="parchment p-6 rounded-sm shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 -mr-8 -mt-8 rotate-45 border border-[#2a1b12]/20" />
        
        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
          <div className="w-full md:w-1/3">
            <img 
              src={activeMember.image} 
              alt={activeMember.name} 
              className="w-full aspect-[3/4] object-cover border-4 border-[#2a1b12] shadow-xl grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase border-b border-[#2a1b12]/20 pb-1">
                <span className="flex items-center gap-1"><ScrollText className="w-3 h-3" /> Viaggi</span>
                <span>{activeMember.stats.voyages}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase border-b border-[#2a1b12]/20 pb-1">
                <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> Oro</span>
                <span>{activeMember.stats.gold}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase border-b border-[#2a1b12]/20 pb-1">
                <span className="flex items-center gap-1"><Sword className="w-3 h-3" /> Battaglie</span>
                <span>{activeMember.stats.battlesWon}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-pirate text-3xl mb-1 text-[#2a1b12] uppercase">{activeMember.name}</h3>
            <p className="font-cinzel text-xs font-bold text-[#00707c] mb-4 tracking-wider uppercase">{activeMember.rank}</p>
            
            <div className="relative">
              <p className="text-sm leading-relaxed mb-6 italic text-[#2a1b12]/80">
                {activeMember.lore}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-500 font-cinzel italic">
        "Nessun parrucchino è stato maltrattato per la creazione di questa ciurma."
      </p>
    </div>
  );
};

export default Guild;
