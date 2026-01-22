
import React, { useState } from 'react';
import { Search as SearchIcon, Compass, Flame, Users } from 'lucide-react';
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

  const popularPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 9);

  return (
    <div className="animate-fadeIn p-4">
      <div className="relative mb-6">
        <SearchIcon className="text-teal" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} size={20} />
        <input 
          type="text" 
          placeholder="Cerca predoni..." 
          className="input-field rounded-xl"
          style={{ paddingLeft: '40px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm ? (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} onClick={() => onUserClick(user.id)} className="post-card p-3 flex items-center gap-4 cursor-pointer">
              <img src={user.avatar} className="w-12 h-12 avatar-circle" alt="" />
              <div>
                <p className="font-bold text-gold">{user.username}</p>
                <p className="text-xs text-gray-500 italic">{user.bio}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="font-cinzel text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Flame size={16} className="text-gold" /> Pirati In Voga
            </h3>
            <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
              {MOCK_USERS.map(user => (
                <div key={user.id} onClick={() => onUserClick(user.id)} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer">
                  <img src={user.avatar} className="w-16 h-16 avatar-circle" alt="" />
                  <span className="text-xs font-bold text-gray-500">{user.username}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-cinzel text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Compass size={16} className="text-teal" /> Esplora Mare
            </h3>
            <div className="grid grid-cols-3 gap-1">
              {popularPosts.map(post => (
                <div key={post.id} onClick={() => onUserClick(post.authorId)} className="aspect-square bg-black cursor-pointer overflow-hidden">
                  <img src={post.image} className="w-full h-full" style={{ objectFit: 'cover' }} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
