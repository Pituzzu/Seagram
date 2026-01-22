
import React, { useState, useRef, useEffect } from 'react';
import PostCard from '../components/PostCard.tsx';
import { INITIAL_STORIES } from '../constants.tsx';
import { Waves, Plus, X, Ship, Skull, Target, Zap } from 'lucide-react';
import { Post, Story, User } from '../types.ts';

interface HomeProps {
  posts: Post[];
  onUserClick: (userId: string) => void;
  currentUser: User;
}

const Home: React.FC<HomeProps> = ({ posts, onUserClick, currentUser }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadStories = () => {
      const localStoriesRaw = localStorage.getItem('seagram_local_stories');
      const localStories = localStoriesRaw ? JSON.parse(localStoriesRaw) : [];
      setStories([...localStories, ...INITIAL_STORIES]);
    };
    loadStories();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStory: Story = {
          id: `story-${Date.now()}`,
          userId: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          image: reader.result as string,
          timestamp: 'Proprio ora',
          viewed: false
        };
        const existingLocal = JSON.parse(localStorage.getItem('seagram_local_stories') || '[]');
        localStorage.setItem('seagram_local_stories', JSON.stringify([newStory, ...existingLocal]));
        setStories(prev => [newStory, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fadeIn w-full pb-10">
      {/* Ship & Crew Header Widget */}
      <div className="mb-6 wood-texture rounded-xl p-4 border border-[#D4AF37]/30 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4">
           <Ship size={120} className="text-gold" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-gold p-1 bg-deep-sea">
               <img src={currentUser.avatar} className="w-full h-full rounded-full object-cover" alt="Tu" />
            </div>
            <div>
              <h2 className="font-pirate text-2xl text-gold">Ciurma Tocca Pelati</h2>
              <p className="text-[10px] text-teal-light uppercase font-bold tracking-widest">Galeone: "La Calva Lucente"</p>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1 text-gold">
                <Zap size={14} />
                <span className="font-pirate text-xl">LV 99</span>
             </div>
             <p className="text-[9px] text-gray-500 uppercase">Status: In Navigazione</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
           <div className="bg-black/30 p-2 rounded border border-teal/20">
              <div className="flex items-center gap-2 mb-1">
                 <Target size={12} className="text-gold" />
                 <span className="text-[10px] uppercase font-bold text-gray-400">Obiettivo Ciurma</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                 <div className="bg-gold h-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[9px] mt-1 text-gold/70">75% - Verso le 10M di Oro</p>
           </div>
           <div className="bg-black/30 p-2 rounded border border-teal/20">
              <div className="flex items-center gap-2 mb-1">
                 <Skull size={12} className="text-gold" />
                 <span className="text-[10px] uppercase font-bold text-gray-400">Predoni Attivi</span>
              </div>
              <p className="font-pirate text-lg text-white">12 / 48</p>
           </div>
        </div>
      </div>

      {/* Stories Bar */}
      <div className="flex gap-4 p-4 mb-6 bg-black/20 rounded-lg border-b border-teal/30" style={{ overflowX: 'auto' }}>
        <div className="flex-shrink-0 flex flex-col items-center gap-1" style={{ width: '64px' }}>
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={currentUser.avatar} className="w-16 h-16 avatar-circle" alt="Tu" />
            <div className="absolute rounded-full p-1" style={{ bottom: 0, right: 0, background: 'var(--teal-light)', border: '2px solid var(--deep-sea)' }}>
              <Plus size={12} color="white" />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
          <span className="text-[10px] font-bold text-gray-500">Arruola</span>
        </div>

        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-1" style={{ width: '64px' }}>
            <div onClick={() => setActiveStoryIndex(index)} className="cursor-pointer">
              <img src={story.avatar} className="w-16 h-16 avatar-circle" alt={story.username} style={{ borderStyle: 'double', borderWidth: '3px', borderColor: 'var(--gold)' }} />
            </div>
            <span onClick={() => onUserClick(story.userId)} className="text-[10px] font-bold text-gold truncate w-full text-center">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {/* Main Feed */}
      <div className="space-y-6">
        <h3 className="font-cinzel text-xs text-gray-500 uppercase tracking-widest px-2 border-l-2 border-gold">Avvistamenti Recenti</h3>
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUserClick={onUserClick} currentUser={currentUser} />
        ))}
        
        <div className="py-10 text-center flex flex-col items-center gap-4 text-gray-500">
           <Waves className="w-8 h-8" style={{ opacity: 0.2 }} />
           <p className="font-cinzel text-[10px] uppercase tracking-widest italic">Nessun altro vascello all'orizzonte</p>
        </div>
      </div>

      {activeStoryIndex !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <button 
            onClick={() => setActiveStoryIndex(null)} 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={32} />
          </button>
          <img src={stories[activeStoryIndex].image} style={{ maxWidth: '90%', maxHeight: '80%', objectFit: 'contain', border: '4px solid var(--gold)', borderRadius: '8px' }} alt="Story" />
          <div className="absolute bottom-10 left-0 right-0 text-center">
             <p className="font-pirate text-2xl text-gold">{stories[activeStoryIndex].username}</p>
             <p className="text-xs text-gray-400">{stories[activeStoryIndex].timestamp}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
