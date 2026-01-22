
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Home from './views/Home.tsx';
import Guild from './views/Guild.tsx';
import Login from './views/Login.tsx';
import Profile from './views/Profile.tsx';
import CreatePost from './views/CreatePost.tsx';
import Notifications from './views/Notifications.tsx';
import Friends from './views/Friends.tsx';
import Search from './views/Search.tsx';
import Messages from './views/Messages.tsx';
import { View, Post, User } from './types.ts';
import { CURRENT_USER, INITIAL_POSTS } from './constants.tsx';
import { apiService } from './services/apiService.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const savedUser = localStorage.getItem('seagram_active_session_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsLoggedIn(true);
          setCurrentView(View.HOME);
          setSelectedProfileId(user.id);
          
          apiService.getPosts().then(fetchedPosts => {
            if (fetchedPosts && fetchedPosts.length > 0) setPosts(fetchedPosts);
          }).catch(() => console.warn("Backend non raggiungibile, uso cache locale."));
        } catch (e) {
          localStorage.removeItem('seagram_active_session_user');
        }
      }
    };
    initApp();
  }, []);

  const handleLogin = async (username: string) => {
    setLoading(true);
    try {
      const user = await apiService.login(username);
      setCurrentUser(user);
      localStorage.setItem('seagram_active_session_user', JSON.stringify(user));
      setSelectedProfileId(user.id);
      setIsLoggedIn(true);
      setCurrentView(View.HOME);
    } catch (e) {
      const mockUser = { ...CURRENT_USER, username, id: `u-${Date.now()}` };
      setCurrentUser(mockUser);
      localStorage.setItem('seagram_active_session_user', JSON.stringify(mockUser));
      setSelectedProfileId(mockUser.id);
      setIsLoggedIn(true);
      setCurrentView(View.HOME);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('seagram_active_session_user');
    setIsLoggedIn(false);
    setCurrentView(View.LOGIN);
  };

  const navigateToProfile = (userId: string) => {
    setSelectedProfileId(userId);
    setCurrentView(View.PROFILE);
  };

  const renderView = () => {
    if (!isLoggedIn) return <Login onLogin={handleLogin} />;

    switch (currentView) {
      case View.HOME:
        return <Home posts={posts} onUserClick={navigateToProfile} currentUser={currentUser} />;
      case View.GUILD:
        return <Guild />;
      case View.CREATE:
        return <CreatePost onPostCreated={() => setCurrentView(View.HOME)} currentUser={currentUser} />;
      case View.PROFILE:
        return <Profile posts={posts} userId={selectedProfileId} onUserClick={navigateToProfile} currentUser={currentUser} />;
      case View.FRIENDS:
        return <Friends onUserClick={navigateToProfile} currentUser={currentUser} />;
      case View.SEARCH:
        return <Search posts={posts} onUserClick={navigateToProfile} />;
      case View.MESSAGES:
        return <Messages currentUser={currentUser} onUserClick={navigateToProfile} />;
      case View.NOTIFICATIONS:
        return <Notifications requests={[]} onAction={() => {}} onUserClick={navigateToProfile} />;
      default:
        return <Home posts={posts} onUserClick={navigateToProfile} currentUser={currentUser} />;
    }
  };

  return (
    <Layout 
      activeView={currentView} 
      onViewChange={(view) => {
        if (view === View.PROFILE) setSelectedProfileId(currentUser.id);
        setCurrentView(view);
      }} 
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
    >
      <div className="container">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mb-4"></div>
            <p className="font-cinzel text-gold animate-pulse">Navigando verso l'orizzonte...</p>
          </div>
        ) : renderView()}
      </div>
    </Layout>
  );
};

export default App;
