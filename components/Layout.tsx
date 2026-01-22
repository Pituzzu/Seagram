
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

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, isLoggedIn, onLogout, notificationCount = 0 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) return <div className="sea-gradient" style={{ minHeight: '100vh' }}>{children}</div>;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Top Navbar */}
      <nav className="navbar-top wood-texture">
        <div className="flex items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => onViewChange(View.HOME)}>
          <Anchor className="text-teal" size={24} />
          <h1 className="font-pirate text-gold" style={{ fontSize: '2rem' }}>Seagram</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare 
            className={activeView === View.MESSAGES ? 'text-teal' : 'text-light'} 
            style={{ cursor: 'pointer' }}
            onClick={() => onViewChange(View.MESSAGES)} 
          />
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu className="text-light" size={24} />
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <div 
        className="wood-texture"
        style={{ 
          position: 'fixed', right: 0, top: 0, height: '100%', width: '280px', zIndex: 200,
          borderLeft: '3px solid var(--gold)', padding: '2rem',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-cinzel text-gold" style={{ fontSize: '1.25rem' }}>Menu Pirata</h2>
          <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none' }}>
            <X className="text-light" size={24} />
          </button>
        </div>
        
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { view: View.HOME, icon: <Compass size={20} />, label: 'Esplora Mare' },
            { view: View.GUILD, icon: <Skull size={20} />, label: 'Gilda Tocca Pelati' },
            { view: View.SEARCH, icon: <Search size={20} />, label: 'Cerca Pirati' },
            { view: View.FRIENDS, icon: <Users size={20} />, label: 'La Mia Ciurma' },
            { view: View.PROFILE, icon: <User size={20} />, label: 'Il Mio Diario' },
          ].map(item => (
            <li 
              key={item.view}
              className="flex items-center gap-4 font-cinzel"
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onClick={() => { onViewChange(item.view); setIsSidebarOpen(false); }}
            >
              {item.icon} {item.label}
            </li>
          ))}
          <li style={{ borderTop: '1px solid rgba(212,175,55,0.3)', margin: '1rem 0' }} />
          <li 
            style={{ color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => { onLogout(); setIsSidebarOpen(false); }}
          >
            <LogOut size={16} /> Abbandona Nave
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="container animate-fadeIn">
        {children}
      </main>

      {/* Bottom Navbar */}
      <div className="navbar-bottom wood-texture">
        {[
          { view: View.HOME, icon: <Home size={28} /> },
          { view: View.SEARCH, icon: <Search size={28} /> },
          { view: View.CREATE, icon: <PlusSquare size={32} />, special: true },
          { view: View.NOTIFICATIONS, icon: <Bell size={28} />, badge: notificationCount },
          { view: View.PROFILE, icon: <User size={28} /> },
        ].map(item => (
          <button 
            key={item.view}
            onClick={() => onViewChange(item.view)}
            style={{ 
              background: item.special ? 'var(--gold)' : 'none',
              color: item.special ? 'var(--wood)' : (activeView === item.view ? 'var(--teal-light)' : '#888'),
              border: 'none', padding: item.special ? '0.5rem' : '0',
              borderRadius: item.special ? '8px' : '0',
              marginTop: item.special ? '-2rem' : '0',
              boxShadow: item.special ? '0 5px 15px rgba(0,0,0,0.5)' : 'none',
              cursor: 'pointer', position: 'relative'
            }}
          >
            {item.icon}
            {item.badge ? (
              <span style={{ 
                position: 'absolute', top: '-5px', right: '-5px', background: 'red', fontSize: '10px', 
                padding: '2px 5px', borderRadius: '10px', color: 'white' 
              }}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Layout;
