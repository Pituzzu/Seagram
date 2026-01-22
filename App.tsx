
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import Guild from './views/Guild';
import Login from './views/Login';
import Profile from './views/Profile';
import CreatePost from './views/CreatePost';
import Notifications from './views/Notifications';
import Friends from './views/Friends';
import Search from './views/Search';
import Messages from './views/Messages';
import { View, Post, CrewRequest, User } from './types';
import { CURRENT_USER } from './constants';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [crewRequests, setCrewRequests] = useState<CrewRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    try {
      const fetchedPosts = await apiService.getPosts();
      setPosts(fetchedPosts);
    } catch (e) {
      console.error("Errore nel caricamento dati dal backend PHP", e);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('seagram_active_session_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentView(View.HOME);
      refreshData();
    }
  }, []);

  const handleLogin = async (username: string, shipName?: string) => {
    setLoading(true);
    try {
      const user = await apiService.login(username, shipName);
      setCurrentUser(user);
      localStorage.setItem('seagram_active_session_user', JSON.stringify(user));
      setSelectedProfileId(user.id);
      setIsLoggedIn(true);
      setCurrentView(View.HOME);
      await refreshData();
    } catch (e) {
      alert("Errore durante l'attracco al porto (Login fallito).");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('seagram_active_session_user');
    setIsLoggedIn(false);
    setCurrentView(View.LOGIN);
  };

  const handlePostCreated = async () => {
    await refreshData();
    setCurrentView(View.HOME);
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
        return <CreatePost onPostCreated={handlePostCreated} currentUser={currentUser} />;
      case View.PROFILE:
        return <Profile posts={posts} userId={selectedProfileId} onUserClick={navigateToProfile} currentUser={currentUser} />;
      case View.NOTIFICATIONS:
        return <Notifications requests={crewRequests} onAction={() => {}} onUserClick={navigateToProfile} />;
      case View.FRIENDS:
        return <Friends onUserClick={navigateToProfile} currentUser={currentUser} />;
      case View.SEARCH:
        return <Search posts={posts} onUserClick={navigateToProfile} />;
      case View.MESSAGES:
        return <Messages currentUser={currentUser} onUserClick={navigateToProfile} />;
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
      notificationCount={0}
    >
      {loading ? (
        <div className="h-full flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37]"></div>
          <p className="mt-4 font-cinzel text-[#D4AF37]">Navigando verso il backend...</p>
        </div>
      ) : renderView()}
    </Layout>
  );
};

export default App;
