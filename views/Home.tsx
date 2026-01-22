
import React, { useState, useRef, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { NEWS_DATA, INITIAL_STORIES } from '../constants';
import { Waves, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <div className="animate-fadeIn w-full">
      {/* Stories Bar */}
      <div className="flex gap-4 p-4 wood-texture" style={{ overflowX: 'auto', borderBottom: '1px solid var(--teal)' }}>
        <div className="flex-shrink-0 flex flex-col items-center gap-1" style={{ width: '64px' }}>
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img src={currentUser.avatar} className="w-16 h-16 avatar-circle" alt="Tu" />
            <div className="absolute rounded-full p-1" style={{ bottom: 0, right: 0, background: 'var(--teal-light)', border: '2px solid var(--deep-sea)' }}>
              <Plus size={12} color="white" />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
          <span className="text-xs font-bold text-gray-500">Tu</span>
        </div>

        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-1" style={{ width: '64px' }}>
            <div onClick={() => setActiveStoryIndex(index)} className="cursor-pointer">
              <img src={story.avatar} className="w-16 h-16 avatar-circle" alt={story.username} style={{ borderStyle: 'double', borderWidth: '3px' }} />
            </div>
            <span onClick={() => onUserClick(story.userId)} className="text-xs font-bold text-gold truncate w-full text-center">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      <div className="py-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUserClick={onUserClick} currentUser={currentUser} />
        ))}
        
        <div className="py-10 text-center flex flex-col items-center gap-4 text-gray-500">
           <Waves className="w-8 h-8" style={{ opacity: 0.2 }} />
           <p className="font-cinzel text-xs uppercase tracking-widest italic">Fine della Rotta</p>
        </div>
      </div>

      {activeStoryIndex !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            onClick={() => setActiveStoryIndex(null)} 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={32} />
          </button>
          <img src={stories[activeStoryIndex].image} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Story" />
        </div>
      )}
    </div>
  );
};

export default Home;
