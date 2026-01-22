
import React, { useState } from 'react';
import { Anchor, Skull, UserPlus, LogIn, Info } from 'lucide-react';
import { apiService } from '../services/apiService.ts';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let user;
      if (isRegister) {
        user = await apiService.register(formData.username, formData.bio);
      } else {
        user = await apiService.login(formData.username);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sea-gradient flex justify-center items-center" style={{ height: '100vh', padding: '1rem' }}>
      <div className="wood-texture animate-fadeIn" style={{ maxWidth: '400px', width: '100%', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-block', padding: '0.8rem', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Anchor className="text-gold" size={40} />
          </div>
          <h1 className="font-pirate text-gold" style={{ fontSize: '3.5rem', letterSpacing: '-2px', lineHeight: 1 }}>Seagram</h1>
          <p className="font-cinzel text-teal" style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem' }}>
            {isRegister ? 'Nuovo Arruolamento' : 'Ritorna sulla Rotta'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-200 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Nome Pirata</label>
            <div className="relative">
               <input 
                required
                className="input-field"
                placeholder="Jack_Sparrow"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {isRegister && (
             <div>
              <label style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Motto della tua Nave</label>
              <textarea 
                className="input-field"
                placeholder="Navigo per l'oro..."
                style={{ height: '60px', resize: 'none' }}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          )}

          <div style={{ opacity: isRegister ? 0.5 : 1 }}>
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

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-wood border-t-transparent rounded-full" />
            ) : (
              isRegister ? <><UserPlus size={18}/> Arruolati</> : <><LogIn size={18}/> Salpa Ora</>
            )}
          </button>
        </form>

        <button 
          onClick={() => { setIsRegister(!isRegister); setError(null); }}
          className="mt-6 text-[10px] font-cinzel text-teal-light uppercase tracking-widest hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
        >
          {isRegister ? 'Hai già una ciurma? Accedi' : 'Non hai una nave? Arruolati'}
        </button>

        <div style={{ marginTop: '1.5rem', opacity: 0.2 }}>
          <Skull size={20} />
        </div>
      </div>
    </div>
  );
};

export default Login;
