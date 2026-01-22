
import { Post, User } from '../types.ts';

const API_URL = 'api.php';

export const apiService = {
  async login(username: string): Promise<User> {
    const response = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Errore durante l\'accesso.');
    return data.user;
  },

  async register(username: string, bio: string): Promise<User> {
    const response = await fetch(`${API_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, bio })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Errore durante la registrazione.');
    return data.user;
  },

  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}?action=get_posts`);
    const data = await response.json();
    if (data.error) return [];
    
    return data.map((p: any) => ({
      id: String(p.id),
      authorId: String(p.user_id),
      author: p.author,
      avatar: p.author_avatar,
      content: p.content,
      timestamp: apiService.formatTime(p.created_at),
      likes: parseInt(p.likes_count) || 0,
      comments: (p.comments || []).map((c: any) => ({
        id: String(c.id),
        authorId: String(c.user_id),
        author: c.author,
        content: c.content,
        timestamp: apiService.formatTime(c.created_at)
      })),
      image: p.image_url
    }));
  },

  async createPost(userId: string, content: string, imageUrl?: string): Promise<void> {
    const response = await fetch(`${API_URL}?action=create_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, content, image_url: imageUrl })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
  },

  async toggleFollow(followerId: string, followingId: string): Promise<void> {
    await fetch(`${API_URL}?action=follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follower_id: followerId, following_id: followingId })
    });
  },

  formatTime(sqlTimestamp: string): string {
    if (!sqlTimestamp) return 'Tempo ignoto';
    const date = new Date(sqlTimestamp.replace(' ', 'T'));
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (isNaN(date.getTime())) return 'Anticamente';
    if (diff < 60) return 'Adesso';
    if (diff < 3600) return `${Math.floor(diff / 60)}m fa`;
    if (diff < 84600) return `${Math.floor(diff / 3600)}h fa`;
    return date.toLocaleDateString();
  }
};
