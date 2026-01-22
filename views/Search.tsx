
import React, { useState } from 'react';
import { Search as SearchIcon, Compass, Flame, Users, Ship } from 'lucide-react';
import { User, Post } from '../types';
import { MOCK_USERS } from '../constants';

interface SearchProps {
  onUserClick: (userId: string) => void;
  posts: Post[];
}

const Search: React.FC<SearchProps> = ({ onUserClick, posts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = MOCK_USERS.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtriamo i post con più like per la sezione "Popolari"
  const popularPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 12);

  return (
    <div className="animate-fadeIn p-4">
      {/* Search Bar */}
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00A3A1]" />
        <input 
          type="text" 
          placeholder="Cerca predoni o ciurme..." 
          className="w-full bg-[#1a2e35] border border-[#00707c]/40 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#D4AF37] transition-all shadow-lg shadow-black/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm ? (
        <div className="space-y-4">
          <h3 className="font-cinzel text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" /> Risultati per i Pirati
          </h3>
          <div className="grid gap-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => onUserClick(user.id)}
                  className="bg-[#1a2e35] p-3 rounded-lg border border-[#00707c]/20 flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/50 transition-colors"
                >
                  <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/30" alt="" />
                  <div>
                    <p className="font-bold text-[#e0d7c6]">{user.username}</p>
                    <p className="text-[10px] text-gray-500 italic">{user.bio.substring(0, 50)}...</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-600 italic">Nessun pirata avvistato all'orizzonte.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Suggested Creators */}
          <div>
            <h3 className="font-cinzel text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Pirati In Voga
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {MOCK_USERS.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => onUserClick(user.id)}
                  className="flex-shrink-0 w-24 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] to-[#00A3A1] group-hover:scale-110 transition-transform">
                    <img src={user.avatar} className="w-full h-full rounded-full border-2 border-[#1a2e35]" alt="" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center">{user.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery Grid */}
          <div>
            <h3 className="font-cinzel text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00A3A1]" /> Esplora il Bottino
            </h3>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {popularPosts.map(post => (
                <div 
                  key={post.id} 
                  className="aspect-square bg-black/20 rounded-md overflow-hidden relative group cursor-pointer"
                  onClick={() => post.authorId && onUserClick(post.authorId)}
                >
                  {post.image ? (
                    <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-[8px] text-gray-600 text-center">
                      {post.content.substring(0, 30)}...
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-[10px] text-white font-bold">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-6 rounded-xl text-center">
            <Ship className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-4" />
            <h4 className="font-cinzel text-sm text-[#D4AF37] mb-2">Sei pronto per nuove rotte?</h4>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              "Il mare è vasto, ma la gilda è ovunque. Cerca i tuoi compagni e non navigare mai solo."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
