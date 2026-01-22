
import React, { useState } from 'react';
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
  const [showComments, setShowComments] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const isSelf = post.authorId === currentUser.id;

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="flex items-center gap-4">
          <img 
            src={post.avatar} 
            className="avatar-circle" 
            style={{ width: '35px', height: '35px', cursor: 'pointer' }}
            onClick={() => onUserClick?.(post.authorId)}
          />
          <div className="flex flex-col">
            <h3 
              className="font-cinzel text-gold" 
              style={{ fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => onUserClick?.(post.authorId)}
            >
              {post.author}
            </h3>
            <span className="text-gray" style={{ fontSize: '0.6rem' }}>{post.timestamp}</span>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-gray" />
      </div>
      
      {/* Media */}
      {post.image && (
        <img src={post.image} className="post-image" onDoubleClick={toggleLike} alt="Avventura" />
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <div className="flex gap-6">
            <button onClick={toggleLike} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Heart size={24} className={liked ? 'text-gold' : 'text-light'} style={{ fill: liked ? 'var(--gold)' : 'none' }} />
            </button>
            <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <MessageCircle size={24} className="text-light" />
            </button>
            <Send size={24} className="text-light" style={{ cursor: 'pointer' }} />
          </div>
          <Anchor size={24} className="text-light" />
        </div>

        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{likesCount} mi piace</p>
        <p style={{ fontSize: '0.9rem' }}>
          <span className="font-cinzel text-gold" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{post.author}</span>
          {post.content}
        </p>
      </div>

      {/* Comment section simplified */}
      {showComments && (
        <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          {post.comments.map(c => (
            <div key={c.id} style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              <span className="text-gold" style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{c.author}</span>
              {c.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
