
import React, { useState, useEffect } from 'react';
import { Users, UserMinus, UserPlus, Search, Skull, Anchor } from 'lucide-react';
import { User } from '../types';
import { MOCK_USERS, CURRENT_USER } from '../constants';

interface FriendsProps {
  onUserClick: (userId: string) => void;
}

const Friends: React.FC<FriendsProps> = ({ onUserClick }) => {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [searchTerm, setSearchTerm] = useState('');
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  
  // Per scopi demo, usiamo i mock users come followers
  const followers = MOCK_USERS.filter(u => u.id !== CURRENT_USER.id);

  useEffect(() => {
    const storedFollowing = JSON.parse(localStorage.getItem('seagram_following') || '[]');
    setFollowingIds([...storedFollowing, ...CURRENT_USER.followingIds]);
  }, []);

  const handleUnfollow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFollowing = followingIds.filter(fId => fId !== id);
    setFollowingIds(newFollowing);
    localStorage.setItem('seagram_following', JSON.stringify(newFollowing.filter(fId => !CURRENT_USER.followingIds.includes(fId))));
    window.dispatchEvent(new Event('following_updated'));
  };

  const followingUsers = MOCK_USERS.filter(u => followingIds.includes(u.id));
  
  const displayList = activeTab === 'following' ? followingUsers : followers;
  const filteredList = displayList.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#00A3A1]/10 rounded-lg border border-[#00A3A1]/30">
          <Users className="w-6 h-6 text-[#00A3A1]" />
        </div>
        <div>
          <h2 className="font-cinzel text-xl text-[#D4AF37]">La Mia Ciurma</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Fratelli di Mare e di Sangue</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Cerca un pirata..." 
          className="w-full bg-[#1a2e35] border border-[#00707c]/30 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF37] transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-[#0c1c22] rounded-lg p-1 border border-[#00707c]/20">
        <button 
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-2 text-xs font-bold font-cinzel rounded-md transition-all ${activeTab === 'following' ? 'bg-[#D4AF37] text-[#2a1b12]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Seguiti ({followingUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('followers')}
          className={`flex-1 py-2 text-xs font-bold font-cinzel rounded-md transition-all ${activeTab === 'followers' ? 'bg-[#D4AF37] text-[#2a1b12]' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Seguaci ({followers.length})
        </button>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filteredList.length > 0 ? (
          filteredList.map(user => (
            <div 
              key={user.id} 
              onClick={() => onUserClick(user.id)}
              className="bg-[#1a2e35] border border-[#00707c]/20 rounded-lg p-3 flex items-center justify-between hover:border-[#D4AF37]/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-[1px] bg-gradient-to-tr from-[#D4AF37] to-[#00A3A1]">
                  <img src={user.avatar} className="w-full h-full rounded-full border-2 border-[#1a2e35] object-cover" alt="" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#e0d7c6] group-hover:text-[#D4AF37] transition-colors">{user.username}</h4>
                  <p className="text-[10px] text-gray-500 truncate max-w-[150px] italic">{user.bio}</p>
                </div>
              </div>

              {activeTab === 'following' && (
                <button 
                  onClick={(e) => handleUnfollow(e, user.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                  title="Smetti di seguire"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              )}
              
              {activeTab === 'followers' && !followingIds.includes(user.id) && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newFollowing = [...followingIds, user.id];
                    setFollowingIds(newFollowing);
                    localStorage.setItem('seagram_following', JSON.stringify(newFollowing.filter(fId => !CURRENT_USER.followingIds.includes(fId))));
                    window.dispatchEvent(new Event('following_updated'));
                  }}
                  className="bg-[#00A3A1] text-white p-2 rounded-full hover:bg-[#00707c] transition-colors"
                  title="Segui anche tu"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-600 italic">
            <Anchor className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-cinzel text-xs">Nessun pirata trovato in questo quadrante.</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 border border-[#D4AF37]/20 rounded-lg bg-[#D4AF37]/5">
        <div className="flex items-center gap-2 mb-2">
          <Skull className="w-4 h-4 text-[#D4AF37]" />
          <h5 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Codice dei Fratelli</h5>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed italic">
          "Ogni pirata è tenuto a rispettare i propri compagni di ciurma. Il tradimento viene punito con una passeggiata sull'asse o, peggio, con una parrucca obbligatoria."
        </p>
      </div>
    </div>
  );
};

export default Friends;
