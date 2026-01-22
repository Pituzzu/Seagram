
import React, { useState, useRef, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { NEWS_DATA, INITIAL_STORIES } from '../constants';
import { Waves, Plus, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { Post, Story, User } from '../types';

interface HomeProps {
  posts: Post[];
  onUserClick: (userId: string) => void;
  currentUser: User;
}

const Home: React.FC<HomeProps> = ({ posts, onUserClick, currentUser }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isUploadingStory, setIsUploadingStory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadStories = () => {
      const localStoriesRaw = localStorage.getItem('seagram_local_stories');
      const localStories = localStoriesRaw ? JSON.parse(localStoriesRaw) : [];
      setStories([...localStories, ...INITIAL_STORIES]);
    };
    loadStories();
    
    window.addEventListener('story_updated', loadStories);
    return () => window.removeEventListener('story_updated', loadStories);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingStory(true);
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
        setIsUploadingStory(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  return (
    <div className="animate-fadeIn max-w-full overflow-x-hidden relative">
      {/* Stories Bar */}
      <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide border-b border-[#00707c]/20 bg-[#0c1c22]">
        <div className="flex-shrink-0 w-16 flex flex-col items-center gap-1">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-16 h-16 rounded-full p-[2px] bg-gray-700">
              <img src={currentUser.avatar} className="w-full h-full rounded-full border-2 border-[#0c1c22] object-cover" alt="Tu" />
            </div>
            <div className="absolute bottom-0 right-0 bg-[#00A3A1] rounded-full p-1 border-2 border-[#0c1c22] text-white">
              <Plus className="w-3 h-3" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500 truncate w-full text-center">Tu</span>
        </div>

        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex-shrink-0 w-16 flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div 
              onClick={() => setActiveStoryIndex(index)}
              className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] to-[#00A3A1] group-hover:scale-105 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-[#1a2e35] border-2 border-[#0c1c22] overflow-hidden">
                 <img src={story.avatar} className="w-full h-full object-cover" alt={story.username} />
              </div>
            </div>
            <span 
              onClick={() => onUserClick(story.userId)}
              className="text-[10px] font-bold text-gray-400 truncate w-full text-center hover:text-[#D4AF37]"
            >
              {story.username}
            </span>
          </div>
        ))}
      </div>

      <div className="py-2">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUserClick={onUserClick} currentUser={currentUser} />
        ))}
        
        <div className="py-10 text-center flex flex-col items-center gap-4 text-gray-500">
           <Waves className="w-8 h-8 opacity-20" />
           <p className="font-cinzel text-xs tracking-widest italic uppercase">Sei arrivato alla fine della rotta</p>
        </div>
      </div>

      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fadeIn">
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-50">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {
                const uid = stories[activeStoryIndex].userId;
                setActiveStoryIndex(null);
                onUserClick(uid);
              }}
            >
              <img src={stories[activeStoryIndex].avatar} className="w-8 h-8 rounded-full border border-white" alt="" />
              <div>
                <p className="text-white text-xs font-bold">{stories[activeStoryIndex].username}</p>
                <p className="text-gray-400 text-[10px]">{stories[activeStoryIndex].timestamp}</p>
              </div>
            </div>
            <button onClick={() => setActiveStoryIndex(null)} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full max-w-lg aspect-[9/16] bg-black flex items-center justify-center">
            <img src={stories[activeStoryIndex].image} className="w-full h-full object-contain" alt="Story" />
            
            <button 
              onClick={(e) => { e.stopPropagation(); prevStory(); }} 
              className={`absolute left-2 p-2 rounded-full bg-black/20 text-white ${activeStoryIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextStory(); }} 
              className="absolute right-2 p-2 rounded-full bg-black/20 text-white"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {isUploadingStory && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1a2e35] p-6 rounded-lg border-2 border-[#D4AF37] flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37] mb-4"></div>
            <p className="font-cinzel text-xs text-[#D4AF37]">Affiggendo la tua storia in bacheca...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
