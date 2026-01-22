
import { Post, User, Message, Conversation, CrewRequest } from '../types';

const API_URL = 'api.php'; // In produzione sarà l'URL completo del server PHP

export const apiService = {
  async login(username: string, shipName?: string): Promise<User> {
    const response = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, shipName })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.user;
  },

  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}?action=get_posts`);
    const data = await response.json();
    return data.map((p: any) => ({
      id: String(p.id),
      authorId: String(p.user_id),
      author: p.author,
      avatar: p.avatar,
      content: p.content,
      timestamp: this.formatTime(p.created_at),
      likes: p.likes_count,
      comments: p.comments.map((c: any) => ({
        id: String(c.id),
        authorId: String(c.user_id),
        author: c.author,
        content: c.content,
        timestamp: this.formatTime(c.created_at)
      })),
      image: p.image_url
    }));
  },

  async createPost(userId: string, content: string, imageUrl?: string): Promise<void> {
    await fetch(`${API_URL}?action=create_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, content, image_url: imageUrl })
    });
  },

  async toggleFollow(followerId: string, followingId: string): Promise<void> {
    await fetch(`${API_URL}?action=follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follower_id: followerId, following_id: followingId })
    });
  },

  formatTime(sqlTimestamp: string): string {
    const date = new Date(sqlTimestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Adesso';
    if (diff < 3600) return `${Math.floor(diff / 60)}m fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`;
    return date.toLocaleDateString();
  }
};
