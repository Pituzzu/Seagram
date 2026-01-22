
import React from 'react';
import { CrewRequest } from '../types';
import { ShieldCheck, ShieldX, Skull, Ship, Anchor } from 'lucide-react';

interface NotificationsProps {
  requests: CrewRequest[];
  onAction: (id: string, action: 'accepted' | 'declined') => void;
  onUserClick: (userId: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ requests, onAction, onUserClick }) => {
  return (
    <div className="animate-fadeIn p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
          <Anchor className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <div>
          <h2 className="font-cinzel text-xl text-[#D4AF37]">Bollettino di Bordo</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Avvisi e Reclutamenti</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-[#1a2e35] rounded-full flex items-center justify-center mb-6 border border-[#00707c]/20 shadow-2xl opacity-50">
             <Ship className="w-10 h-10 text-gray-500" />
          </div>
          <p className="font-cinzel text-gray-400 italic">Orizzonte sgombro. Nessuna richiesta in sospeso.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Richieste di Arruolamento ({requests.length})</h3>
          {requests.map((req) => (
            <div key={req.id} className="bg-[#1a2e35] border border-[#00707c]/30 rounded-lg p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onUserClick(req.fromUserId)}
                >
                  <img src={req.fromAvatar} alt={req.fromUsername} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm">
                    <span 
                      className="font-bold text-[#D4AF37] cursor-pointer hover:underline"
                      onClick={() => onUserClick(req.fromUserId)}
                    >
                      {req.fromUsername}
                    </span>
                    <span className="text-gray-300"> chiede di unirsi alla tua ciurma</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">{req.timestamp}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onAction(req.id, 'accepted')}
                  className="p-2 bg-[#00A3A1] text-white rounded hover:bg-[#00707c] transition-colors"
                  title="Accetta"
                >
                  <ShieldCheck className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onAction(req.id, 'declined')}
                  className="p-2 bg-red-900/40 text-red-400 border border-red-500/30 rounded hover:bg-red-900/60 transition-colors"
                  title="Rifiuta"
                >
                  <ShieldX className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Notifications Placeholder */}
      <div className="mt-12 opacity-30 pointer-events-none">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Attività Recenti</h3>
        <div className="space-y-4">
           {[1,2].map(i => (
             <div key={i} className="flex items-center gap-4 py-2 border-b border-[#00707c]/10">
                <div className="w-8 h-8 rounded-full bg-gray-800" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
