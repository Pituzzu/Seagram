
import React, { useState } from 'react';
import { Menu, X, Home, Skull, Bell, User, PlusSquare, Anchor, Compass, LogOut, Users, Search, MessageSquare } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  notificationCount?: number;
  messageCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, isLoggedIn, onLogout, notificationCount = 0, messageCount = 0 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) return <div className="min-h-screen bg-[#0c1c22]">{children}</div>;

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-[#0c1c22]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 wood-texture border-b border-[#D4AF37]/40 shadow-xl py-2 px-4 flex justify-between items-center h-14">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange(View.HOME)}>
          <Anchor className="text-[#00A3A1] w-6 h-6" />
          <h1 className="font-pirate text-3xl text-[#D4AF37] tracking-tighter select-none">Seagram</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare 
            className={`w-6 h-6 cursor-pointer transition-colors ${activeView === View.MESSAGES ? 'text-[#00A3A1]' : 'text-[#e0d7c6] hover:text-[#00A3A1]'}`} 
            onClick={() => onViewChange(View.MESSAGES)} 
          />
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 hover:bg-[#3d2b1f] rounded-full transition-colors"
          >
            <Menu className="text-[#e0d7c6] w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Sidebar (Right) */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-72 wood-texture border-l-2 border-[#D4AF37] p-6 shadow-2xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-cinzel text-xl text-[#D4AF37]">Menu Pirata</h2>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6 text-[#e0d7c6]" />
            </button>
          </div>
          
          <ul className="space-y-6 font-cinzel text-lg">
            <li className="flex items-center gap-4 hover:text-[#00A3A1] cursor-pointer transition-colors" onClick={() => { onViewChange(View.HOME); setIsSidebarOpen(false); }}>
              <Compass className="w-5 h-5" /> Esplora Mare
            </li>
            <li className="flex items-center gap-4 hover:text-[#00A3A1] cursor-pointer transition-colors" onClick={() => { onViewChange(View.GUILD); setIsSidebarOpen(false); }}>
              <Skull className="w-5 h-5" /> Gilda Tocca Pelati
            </li>
            <li className="flex items-center gap-4 hover:text-[#00A3A1] cursor-pointer transition-colors" onClick={() => { onViewChange(View.SEARCH); setIsSidebarOpen(false); }}>
              <Search className="w-5 h-5" /> Cerca Pirati
            </li>
            <li className="flex items-center gap-4 hover:text-[#00A3A1] cursor-pointer transition-colors" onClick={() => { onViewChange(View.FRIENDS); setIsSidebarOpen(false); }}>
              <Users className="w-5 h-5" /> La Mia Ciurma
            </li>
            <li className="flex items-center gap-4 hover:text-[#00A3A1] cursor-pointer transition-colors" onClick={() => { onViewChange(View.PROFILE); setIsSidebarOpen(false); }}>
              <User className="w-5 h-5" /> Il Mio Diario
            </li>
            <li className="border-t border-[#D4AF37]/30 my-6" />
            <li className="text-red-400 hover:text-red-300 cursor-pointer text-sm mt-10 flex items-center gap-2" onClick={() => { onLogout(); setIsSidebarOpen(false); }}>
              <LogOut className="w-4 h-4" /> Abbandona Nave
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl mx-auto w-full p-0 sm:p-4">
        {children}
      </main>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 wood-texture border-t border-[#D4AF37]/30 z-50 h-16 flex items-center justify-around px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
        <button onClick={() => onViewChange(View.HOME)} className={activeView === View.HOME ? 'text-[#00A3A1]' : 'text-gray-400'}>
          <Home className="w-7 h-7" />
        </button>
        <button onClick={() => onViewChange(View.SEARCH)} className={activeView === View.SEARCH ? 'text-[#00A3A1]' : 'text-gray-400'}>
          <Search className="w-7 h-7" />
        </button>
        <button onClick={() => onViewChange(View.CREATE)} className="bg-[#D4AF37] text-[#2a1b12] p-2 rounded-lg -mt-8 shadow-2xl hover:scale-110 transition-transform active:scale-95">
          <PlusSquare className="w-8 h-8" />
        </button>
        <button onClick={() => onViewChange(View.NOTIFICATIONS)} className={`relative ${activeView === View.NOTIFICATIONS ? 'text-[#00A3A1]' : 'text-gray-400'}`}>
          <Bell className="w-7 h-7" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#2a1b12]">
              {notificationCount}
            </span>
          )}
        </button>
        <button onClick={() => onViewChange(View.PROFILE)} className={activeView === View.PROFILE ? 'text-[#00A3A1]' : 'text-gray-400'}>
          <User className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default Layout;
