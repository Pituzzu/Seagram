
import { Post, NewsItem, GuildMember, User, Story } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  username: 'Capitano_Pelato',
  avatar: 'https://picsum.photos/seed/captain/150/150',
  bio: 'Fondatore della Ciurma dei Tocca Pelati. Navigo per l\'oro, resto per il rum. 🏴‍☠️✨ #NoHairNoProblem',
  lore: 'Nato durante una tempesta nel Devil\'s Roar, il Capitano ha perso i capelli non per l\'età, ma per l\'attrito causato dalla velocità con cui saccheggiava i forti degli scheletri.',
  stats: {
    posts: 42,
    followers: 1205,
    following: 88
  },
  followingIds: ['u2', 'u3'],
  followerIds: ['u2']
};

export const MOCK_USERS: User[] = [
  {
    id: 'u2',
    username: 'Steve_SenzaPeli',
    avatar: 'https://picsum.photos/seed/m2/150/150',
    bio: 'Mastro Cannoniere dei Tocca Pelati.',
    lore: 'Si dice che i suoi cannoni non manchino mai il bersaglio perché la luce che riflette dalla sua testa acceca i nemici a poppa.',
    stats: { posts: 12, followers: 450, following: 120 },
    followingIds: ['u1'],
    followerIds: ['u1']
  },
  {
    id: 'u3',
    username: 'Lucia_La_Liscia',
    avatar: 'https://picsum.photos/seed/m3/150/150',
    bio: 'Navigatrice Folle. Odio le parrucche.',
    lore: 'Ha attraversato il Mare dei Dannati tre volte solo per trovare un pettine... che poi ha buttato via per principio.',
    stats: { posts: 25, followers: 890, following: 200 },
    followingIds: ['u1'],
    followerIds: ['u1']
  },
  {
    id: 'u4',
    username: 'Barba_Dura',
    avatar: 'https://picsum.photos/seed/beard/150/150',
    bio: 'Non tocco i pelati, ma li rispetto.',
    stats: { posts: 5, followers: 10, following: 50 },
    followingIds: [],
    followerIds: []
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    userId: 'u2',
    username: 'Steve_SenzaPeli',
    avatar: 'https://picsum.photos/seed/m2/100/100',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    timestamp: '2h fa',
    viewed: false
  },
  {
    id: 's2',
    userId: 'u3',
    username: 'Lucia_La_Liscia',
    avatar: 'https://picsum.photos/seed/m3/100/100',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    timestamp: '5h fa',
    viewed: false
  }
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    title: 'Seagram: Il Nuovo Social per Predoni',
    summary: 'La taverna digitale è ufficialmente aperta. Posta i tuoi tesori e trova la tua ciurma!',
    date: 'Oggi',
    category: 'Community'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u1',
    author: 'Capitano_Pelato',
    avatar: 'https://picsum.photos/seed/captain/100/100',
    content: 'Un tramonto che vale più di mille forzieri del mietitore. #SeaOfThieves #Seagram',
    timestamp: '1h fa',
    likes: 124,
    isLiked: true,
    comments: [
      // Fix: Added missing authorId to satisfy the Comment interface
      { id: 'c1', authorId: 'u2', author: 'Senza Peli Steve', content: 'Che vista Capitano!', timestamp: '45m fa' }
    ],
    image: 'https://images.unsplash.com/photo-1519114056088-b877fe073a5e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2',
    authorId: 'u3',
    author: 'Lucia_La_Liscia',
    avatar: 'https://picsum.photos/seed/m3/100/100',
    content: 'Oggi abbiamo avvistato lo Shrouded Ghost! Giuro!',
    timestamp: '3h fa',
    likes: 89,
    comments: [],
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=800&q=80'
  }
];

export const GUILD_MEMBERS: GuildMember[] = [
  {
    id: 'm1',
    name: 'Capitano Pelato',
    rank: 'Capitano Fondatore',
    lore: 'Il leggendario fondatore. La sua testa riflette la luce della Stella Polare.',
    image: 'https://picsum.photos/seed/m1/300/400',
    stats: { voyages: 450, gold: '12M', battlesWon: 1200 }
  }
];
