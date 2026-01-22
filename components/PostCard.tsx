
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Anchor, MoreHorizontal, UserPlus, UserCheck } from 'lucide-react';
import { Post, Comment, User } from '../types';

interface PostCardProps {
  post: Post;
  onUserClick?: (userId: string) => void;
  currentUser: User;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUserClick, currentUser }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const following = JSON.parse(localStorage.getItem('seagram_following') || '[]');
    setIsFollowing(following.includes(post.authorId));
  }, [post.authorId]);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      author: currentUser.username,
      content: newComment,
      timestamp: 'Proprio ora'
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment('');

    // In un'app reale salveremmo questo nel database del post
    // Per ora aggiorniamo i post locali se è un post creato dall'utente
    const localPosts = JSON.parse(localStorage.getItem('seagram_local_posts') || '[]');
    const updatedLocalPosts = localPosts.map((p: Post) => 
      p.id === post.id ? { ...p, comments: updatedComments } : p
    );
    localStorage.setItem('seagram_local_posts', JSON.stringify(updatedLocalPosts));
  };

  const toggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const following = JSON.parse(localStorage.getItem('seagram_following') || '[]');
    let newFollowing;
    if (isFollowing) {
      newFollowing = following.filter((id: string) => id !== post.authorId);
    } else {
      newFollowing = [...following, post.authorId];
    }
    localStorage.setItem('seagram_following', JSON.stringify(newFollowing));
    setIsFollowing(!isFollowing);
    window.dispatchEvent(new Event('following_updated'));
  };

  const isSelf = post.authorId === currentUser.id;

  return (
    <div className="bg-[#1a2e35] border-y sm:border border-[#00707c]/30 sm:rounded-lg overflow-hidden mb-4 sm:mb-8 shadow-md transition-all">
      {/* Post Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-[2px] rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#00A3A1] cursor-pointer"
            onClick={() => onUserClick?.(post.authorId)}
          >
            <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-[#1a2e35] object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 
                className="font-cinzel text-xs text-[#D4AF37] font-bold hover:underline cursor-pointer"
                onClick={() => onUserClick?.(post.authorId)}
              >
                {post.author}
              </h3>
              {!isSelf && (
                <button 
                  onClick={toggleFollow}
                  className={`text-[10px] px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                    isFollowing 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-[#00A3A1] text-white hover:bg-[#00707c]'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-2.5 h-2.5" /> : <UserPlus className="w-2.5 h-2.5" />}
                  {isFollowing ? 'Seguito' : 'Segui'}
                </button>
              )}
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-500 cursor-pointer" />
      </div>
      
      {/* Post Media */}
      {post.image && (
        <div className="bg-black flex items-center justify-center min-h-[300px] overflow-hidden">
          <img 
            src={post.image} 
            alt="Sea of Thieves adventure" 
            className="w-full h-auto object-contain max-h-[600px] hover:scale-105 transition-transform duration-700"
            onDoubleClick={toggleLike}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`transition-transform active:scale-125 ${liked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </button>
          <button onClick={() => setShowComments(!showComments)} className={`transition-colors ${showComments ? 'text-[#00A3A1]' : 'text-gray-300 hover:text-[#00A3A1]'}`}>
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-[#00A3A1] transition-colors">
            <Send className="w-6 h-6" />
          </button>
        </div>
        <button className="text-gray-300 hover:text-[#D4AF37] transition-colors">
          <Anchor className="w-6 h-6" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-3 py-2">
        <p className="text-sm font-bold text-[#e0d7c6] mb-1">{likesCount.toLocaleString()} mi piace</p>
        <p className="text-sm leading-snug">
          <span 
            className="font-bold mr-2 text-[#D4AF37] cursor-pointer hover:underline"
            onClick={() => onUserClick?.(post.authorId)}
          >
            {post.author}
          </span>
          {post.content}
        </p>
        
        {comments.length > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-gray-500 mt-2 hover:underline"
          >
            {showComments ? 'Nascondi commenti' : `Visualizza tutti i ${comments.length} commenti`}
          </button>
        )}
        
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{post.timestamp}</p>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-3 py-2 space-y-3 bg-black/10 border-t border-[#00707c]/10">
          {comments.map(c => (
            <div key={c.id} className="text-xs">
              <span className="font-bold text-[#D4AF37] mr-2">{c.author}</span>
              <span className="text-gray-300">{c.content}</span>
              <p className="text-[9px] text-gray-600 mt-1">{c.timestamp}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="px-3 py-3 border-t border-[#00707c]/20 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Aggiungi un commento..." 
          className="bg-transparent text-sm w-full outline-none text-gray-300 placeholder:text-gray-600"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!newComment.trim()}
          className="text-[#00A3A1] text-sm font-bold disabled:opacity-30 hover:text-[#00D4D1] transition-colors"
        >
          Pubblica
        </button>
      </form>
    </div>
  );
};

export default PostCard;
