
import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { Grid, Bookmark, Tag, UserPlus, UserCheck, Anchor, Edit3, Save, Sparkles, BookOpen } from 'lucide-react';
import { Post, User, CrewRequest } from '../types';
import { generatePirateLore } from '../services/geminiService';

interface ProfileProps {
  posts: Post[];
  userId: string;
  onUserClick: (userId: string) => void;
  currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({ posts, userId, onUserClick, currentUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editLore, setEditLore] = useState('');
  const [isGeneratingLore, setIsGeneratingLore] = useState(false);

  useEffect(() => {
    const targetUser = MOCK_USERS.find(u => u.id === userId) || currentUser;
    setUser(targetUser);
    setEditBio(targetUser.bio);
    setEditLore(targetUser.lore || '');
  }, [userId, currentUser]);

  if (!user) return null;
  const isSelf = userId === currentUser.id;
  const userPosts = posts.filter(p => p.authorId === userId);

  return (
    <div className="animate-fadeIn pb-10">
      <header className="p-6">
        <div className="flex items-center gap-6 mb-6">
          <img src={user.avatar} className="w-24 h-24 avatar-circle" alt={user.username} />
          <div className="flex-1">
            <h2 className="font-cinzel text-xl text-gold mb-2">{user.username}</h2>
            <div className="flex gap-2">
              {isSelf ? (
                <button onClick={() => setIsEditing(!isEditing)} className="btn-primary text-xs px-4 py-1">
                  {isEditing ? 'Annulla' : 'Modifica'}
                </button>
              ) : (
                <button className="btn-primary text-xs px-4 py-1" style={{ background: 'var(--teal)' }}>
                  Segui
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 text-center py-4 mb-4" style={{ borderTop: '1px solid var(--teal)', borderBottom: '1px solid var(--teal)' }}>
          <div><p className="font-bold">{userPosts.length}</p><p className="text-xs text-gray-500">post</p></div>
          <div><p className="font-bold">{user.stats.followers}</p><p className="text-xs text-gray-500">seguaci</p></div>
          <div><p className="font-bold">{user.stats.following}</p><p className="text-xs text-gray-500">seguiti</p></div>
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm italic">{user.bio}</p>
            {user.lore && (
              <div className="parchment p-4 rounded border-l-4" style={{ borderColor: 'var(--gold)' }}>
                <h4 className="font-cinzel text-xs font-bold mb-2">DIARIO DI BORDO</h4>
                <p className="text-sm italic">"{user.lore}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
             <textarea className="input-field rounded" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Motto..." />
             <button className="btn-primary p-2 rounded">Salva Cambiamenti</button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-1">
        {userPosts.map(post => (
          <div key={post.id} className="aspect-square bg-black overflow-hidden cursor-pointer">
            <img src={post.image} className="w-full h-full" style={{ objectFit: 'cover' }} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
