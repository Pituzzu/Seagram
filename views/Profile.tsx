
import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { Grid, Settings, Bookmark, Tag, UserPlus, UserCheck, MessageSquare, Anchor, Edit3, Save, Sparkles, BookOpen } from 'lucide-react';
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
  const [localFollowingCount, setLocalFollowingCount] = useState(0);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editLore, setEditLore] = useState('');
  const [isGeneratingLore, setIsGeneratingLore] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUserData = localStorage.getItem(`seagram_user_data_${userId}`);
      let targetUser: User;
      
      if (userId === currentUser.id) {
        // Se visualizziamo noi stessi, usiamo sempre il currentUser più aggiornato
        targetUser = currentUser;
      } else if (storedUserData) {
        targetUser = JSON.parse(storedUserData);
      } else {
        targetUser = MOCK_USERS.find(u => u.id === userId) || currentUser;
      }
      
      setUser(targetUser);
      setEditBio(targetUser.bio);
      setEditLore(targetUser.lore || '');
    };

    loadUser();

    const checkState = () => {
      const following = JSON.parse(localStorage.getItem('seagram_following') || '[]');
      setIsFollowing(following.includes(userId));
      setLocalFollowingCount(following.length);

      const requests: CrewRequest[] = JSON.parse(localStorage.getItem('seagram_crew_requests') || '[]');
      const myRequest = requests.find(r => r.fromUserId === currentUser.id && r.toUserId === userId);
      if (myRequest) {
        setRequestStatus(myRequest.status as any);
      } else {
        setRequestStatus('none');
      }
    };

    checkState();
    window.addEventListener('following_updated', checkState);
    window.addEventListener('user_data_updated', loadUser);
    return () => {
      window.removeEventListener('following_updated', checkState);
      window.removeEventListener('user_data_updated', loadUser);
    };
  }, [userId, currentUser]);

  if (!user) return null;

  const isSelf = userId === currentUser.id;
  const userPosts = posts.filter(p => p.authorId === userId);
  
  const displayFollowing = isSelf 
    ? (localFollowingCount + currentUser.followingIds.length) 
    : user.stats.following;

  const toggleFollow = () => {
    const following = JSON.parse(localStorage.getItem('seagram_following') || '[]');
    let newFollowing;
    if (isFollowing) {
      newFollowing = following.filter((id: string) => id !== userId);
    } else {
      newFollowing = [...following, userId];
    }
    localStorage.setItem('seagram_following', JSON.stringify(newFollowing));
    window.dispatchEvent(new Event('following_updated'));
  };

  const handleEnlistRequest = () => {
    if (requestStatus !== 'none') return;

    const newRequest: CrewRequest = {
      id: `req-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUsername: currentUser.username,
      fromAvatar: currentUser.avatar,
      toUserId: userId,
      status: 'pending',
      timestamp: 'Proprio ora'
    };

    const existingReqs = JSON.parse(localStorage.getItem('seagram_crew_requests') || '[]');
    localStorage.setItem('seagram_crew_requests', JSON.stringify([...existingReqs, newRequest]));
    setRequestStatus('pending');
  };

  const saveProfile = () => {
    const updatedUser = { ...user, bio: editBio, lore: editLore };
    localStorage.setItem(`seagram_user_data_${userId}`, JSON.stringify(updatedUser));
    // Se è il nostro profilo, aggiorniamo anche la sessione
    if (isSelf) {
      localStorage.setItem('seagram_active_session_user', JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
    setIsEditing(false);
    window.dispatchEvent(new Event('user_data_updated'));
  };

  const generateLore = async () => {
    setIsGeneratingLore(true);
    try {
      const newLore = await generatePirateLore(user.username);
      setEditLore(newLore);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingLore(false);
    }
  };

  return (
    <div className="animate-fadeIn pb-10">
      <header className="px-4 pt-6 pb-8">
        <div className="flex items-center gap-6 sm:gap-10 mb-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] to-[#00A3A1]">
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-full h-full rounded-full border-2 border-[#0c1c22] object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h2 className="font-cinzel text-lg sm:text-xl text-[#D4AF37]">{user.username}</h2>
              <div className="flex flex-wrap gap-2">
                {isSelf ? (
                  <>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#1a2e35] text-xs font-bold px-4 py-1.5 rounded border border-[#00707c]/50 hover:bg-[#25424c] transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="w-3 h-3" /> Modifica
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={saveProfile}
                          className="bg-[#00A3A1] text-white text-xs font-bold px-4 py-1.5 rounded border border-[#00707c] hover:bg-[#00707c] transition-colors flex items-center gap-2"
                        >
                          <Save className="w-3 h-3" /> Salva
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="bg-red-900/40 text-red-400 text-xs font-bold px-4 py-1.5 rounded border border-red-500/30 hover:bg-red-900/60 transition-colors"
                        >
                          Annulla
                        </button>
                      </div>
                    )}
                    <Settings className="w-5 h-5 text-gray-300 cursor-pointer" />
                  </>
                ) : (
                  <>
                    <button 
                      onClick={toggleFollow}
                      className={`flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded border transition-colors ${
                        isFollowing 
                        ? 'bg-gray-700 border-gray-600 text-gray-300' 
                        : 'bg-[#00A3A1] border-[#00707c] text-white hover:bg-[#00707c]'
                      }`}
                    >
                      {isFollowing ? <><UserCheck className="w-3 h-3"/> Seguito</> : <><UserPlus className="w-3 h-3"/> Segui</>}
                    </button>
                    <button 
                      onClick={handleEnlistRequest}
                      disabled={requestStatus !== 'none'}
                      className={`flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded border transition-colors ${
                        requestStatus === 'pending'
                        ? 'bg-[#1a2e35] border-[#D4AF37]/30 text-[#D4AF37]'
                        : requestStatus === 'accepted'
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-[#2a1b12]'
                        : 'bg-[#D4AF37]/10 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                      }`}
                    >
                      <Anchor className="w-3 h-3" />
                      {requestStatus === 'pending' ? 'In Attesa...' : requestStatus === 'accepted' ? 'In Ciurma' : 'Arruolati'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-8 text-sm">
              <div><span className="font-bold">{userPosts.length}</span> post</div>
              <div><span className="font-bold">{user.stats.followers}</span> seguaci</div>
              <div><span className="font-bold">{displayFollowing}</span> seguiti</div>
            </div>
          </div>
        </div>

        <div className="sm:hidden grid grid-cols-3 text-center border-y border-[#00707c]/20 py-3 mb-6">
          <div className="text-xs">
            <p className="font-bold">{userPosts.length}</p>
            <p className="text-gray-500">post</p>
          </div>
          <div className="text-xs">
            <p className="font-bold">{user.stats.followers}</p>
            <p className="text-gray-500">seguaci</p>
          </div>
          <div className="text-xs">
            <p className="font-bold">{displayFollowing}</p>
            <p className="text-gray-500">seguiti</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#e0d7c6]">{user.username}</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap mt-1 italic">{user.bio}</p>
            </div>
            
            {user.lore && (
              <div className="parchment p-4 rounded shadow-lg border-l-4 border-[#D4AF37] relative overflow-hidden">
                <BookOpen className="absolute top-2 right-2 w-10 h-10 text-[#2a1b12]/10" />
                <h4 className="font-cinzel text-[10px] font-black uppercase text-[#2a1b12] mb-1 tracking-widest">Diario di Bordo: Lore</h4>
                <p className="text-sm text-[#2a1b12] italic leading-relaxed">
                  "{user.lore}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-[10px] font-bold text-[#D4AF37] uppercase mb-1">Motto del Pirata (Bio)</label>
              <textarea 
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-[#0c1c22] border border-[#00707c] rounded p-3 text-sm outline-none focus:border-[#D4AF37] transition-colors min-h-[80px] resize-none"
                placeholder="Inserisci il tuo motto..."
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-[#D4AF37] uppercase">La Tua Lore Leggendaria</label>
                <button 
                  onClick={generateLore}
                  disabled={isGeneratingLore}
                  className="flex items-center gap-1 text-[9px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 ${isGeneratingLore ? 'animate-spin' : ''}`} />
                  {isGeneratingLore ? 'Invocando Gemini...' : 'Ispirazione Gemini'}
                </button>
              </div>
              <textarea 
                value={editLore}
                onChange={(e) => setEditLore(e.target.value)}
                className="w-full bg-[#0c1c22] border border-[#00707c] rounded p-3 text-sm outline-none focus:border-[#D4AF37] transition-colors min-h-[120px] resize-none italic"
                placeholder="Scrivi la storia delle tue cicatrici e dei tuoi tesori..."
              />
            </div>
          </div>
        )}
      </header>

      {isSelf && !isEditing && (
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pirati suggeriti</h4>
            <button className="text-[#00A3A1] text-xs font-bold">Mostra tutti</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {MOCK_USERS.filter(u => u.id !== currentUser.id).map(u => (
              <div 
                key={u.id} 
                className="flex-shrink-0 w-32 bg-[#1a2e35] border border-[#00707c]/20 rounded p-4 flex flex-col items-center text-center cursor-pointer hover:border-[#D4AF37]/50 transition-colors"
                onClick={() => onUserClick(u.id)}
              >
                <img src={u.avatar} className="w-16 h-16 rounded-full mb-2 object-cover border border-[#D4AF37]/50" alt="" />
                <p className="text-xs font-bold text-[#D4AF37] truncate w-full mb-3">{u.username}</p>
                <button 
                  className="w-full py-1.5 bg-[#00A3A1] text-white text-[10px] font-bold rounded hover:bg-[#00707c] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUserClick(u.id);
                  }}
                >
                  Profilo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex border-t border-[#00707c]/20">
        <button className="flex-1 flex items-center justify-center py-3 border-t-2 border-[#D4AF37] text-[#D4AF37]">
          <Grid className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-gray-600 hover:text-gray-400">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="flex-1 flex items-center justify-center py-3 text-gray-600 hover:text-gray-400">
          <Tag className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden bg-black/20">
              {post.image ? (
                <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-gray-400">
                  {post.content.substring(0, 50)}...
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                 <span className="flex items-center gap-1">❤️ {post.likes}</span>
                 <span className="flex items-center gap-1">💬 {post.comments.length}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-20 text-center text-gray-600 italic font-cinzel text-sm">
            Nessun tesoro ancora condiviso...
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
