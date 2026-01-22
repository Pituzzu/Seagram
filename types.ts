
export interface User {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  lore?: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  followingIds: string[];
  followerIds: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  image?: string;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  image: string;
  timestamp: string;
  viewed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage?: string;
  messages: Message[];
}

export interface CrewRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'Update' | 'Event' | 'Community';
}

export interface GuildMember {
  id: string;
  name: string;
  rank: string;
  lore: string;
  image: string;
  stats: {
    voyages: number;
    gold: string;
    battlesWon: number;
  };
}

export enum View {
  HOME = 'home',
  GUILD = 'guild',
  CREATE = 'create',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
  LOGIN = 'login',
  FRIENDS = 'friends',
  SEARCH = 'search',
  MESSAGES = 'messages'
}
