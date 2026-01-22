
import React, { useState } from 'react';
import { Anchor, Skull } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, shipName?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.username);
  };

  return (
    <div className="sea-gradient flex justify-center items-center" style={{ height: '100vh', padding: '1rem' }}>
      <div className="wood-texture animate-fadeIn" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', borderRadius: '12px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '1rem', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Anchor className="text-gold" size={48} />
          </div>
          <h1 className="font-pirate text-gold" style={{ fontSize: '4rem', letterSpacing: '-2px' }}>Seagram</h1>
          <p className="font-cinzel text-teal" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Ritorna sulla Rotta</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Nome Pirata</label>
            <input 
              required
              className="input-field"
              placeholder="Jack_Sparrow"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Codice Segreto</label>
            <input 
              required
              type="password" 
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}>
            Salpa Ora
          </button>
        </form>

        <div style={{ marginTop: '2rem', opacity: 0.3 }}>
          <Skull size={24} />
        </div>
      </div>
    </div>
  );
};

export default Login;
