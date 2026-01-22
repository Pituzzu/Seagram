
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Anchor, Skull } from 'lucide-react';
import { User, Conversation, Message } from '../types';
import { MOCK_USERS } from '../constants';

interface MessagesProps {
  currentUser: User;
  onUserClick: (userId: string) => void;
}

const Messages: React.FC<MessagesProps> = ({ currentUser, onUserClick }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carichiamo o creiamo conversazioni iniziali mock
    const saved = localStorage.getItem('seagram_conversations');
    if (saved) {
      setConversations(JSON.parse(saved));
    } else {
      const initial: Conversation[] = MOCK_USERS.filter(u => u.id !== currentUser.id).slice(0, 2).map(u => ({
        id: `conv-${u.id}`,
        participantId: u.id,
        participantName: u.username,
        participantAvatar: u.avatar,
        lastMessage: "Salute pirata! Ci vediamo in taverna?",
        messages: [
          { id: 'm1', senderId: u.id, content: "Salute pirata!", timestamp: '10:30' },
          { id: 'm2', senderId: u.id, content: "Ci vediamo in taverna?", timestamp: '10:31' }
        ]
      }));
      setConversations(initial);
      localStorage.setItem('seagram_conversations', JSON.stringify(initial));
    }
  }, [currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConvId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = conversations.map(c => 
      c.id === activeConvId 
        ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage } 
        : c
    );

    setConversations(updated);
    setNewMessage('');
    localStorage.setItem('seagram_conversations', JSON.stringify(updated));

    // Simulazione risposta automatica
    setTimeout(() => {
      const reply: Message = {
        id: `reply-${Date.now()}`,
        senderId: activeConv!.participantId,
        content: "Ricevuto capitano! Pancia a terra e vele al vento!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const withReply = updated.map(c => 
        c.id === activeConvId 
          ? { ...c, messages: [...c.messages, reply], lastMessage: reply.content } 
          : c
      );
      setConversations(withReply);
      localStorage.setItem('seagram_conversations', JSON.stringify(withReply));
    }, 2000);
  };

  if (activeConvId && activeConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] animate-fadeIn">
        {/* Chat Header */}
        <div className="p-4 wood-texture border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveConvId(null)} className="p-1 hover:bg-[#3d2b1f] rounded-full text-[#D4AF37]">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onUserClick(activeConv.participantId)}>
              <img src={activeConv.participantAvatar} className="w-10 h-10 rounded-full border border-[#D4AF37]/50" alt="" />
              <div>
                <p className="font-cinzel text-sm text-[#D4AF37] leading-none">{activeConv.participantName}</p>
                <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1">In Mare</p>
              </div>
            </div>
          </div>
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </div>

        {/* Messages Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 scrollbar-hide"
        >
          {activeConv.messages.map(m => (
            <div 
              key={m.id} 
              className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-md ${
                m.senderId === currentUser.id 
                  ? 'bg-[#00707c] text-white rounded-tr-none' 
                  : 'bg-[#1a2e35] text-gray-200 border border-[#00707c]/20 rounded-tl-none'
              }`}>
                {m.content}
                <p className={`text-[9px] mt-1 text-right opacity-60`}>{m.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-[#00707c]/20 bg-[#0c1c22]">
          <div className="flex items-center gap-2 bg-[#1a2e35] rounded-full px-4 py-2 border border-[#00707c]/30">
            <input 
              type="text" 
              placeholder="Invia un messaggio..." 
              className="bg-transparent flex-1 outline-none text-sm text-gray-200"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
            />
            <button type="submit" disabled={!newMessage.trim()} className="text-[#00A3A1] disabled:opacity-30">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#00A3A1]/10 rounded-lg border border-[#00A3A1]/30">
          <Anchor className="w-6 h-6 text-[#00A3A1]" />
        </div>
        <div>
          <h2 className="font-cinzel text-xl text-[#D4AF37]">Bottiglie Messaggio</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Conversazioni Private</p>
        </div>
      </div>

      <div className="space-y-2">
        {conversations.length > 0 ? (
          conversations.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setActiveConvId(conv.id)}
              className="bg-[#1a2e35] p-4 rounded-xl border border-[#00707c]/10 flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/30 transition-all active:scale-[0.98]"
            >
              <div className="relative">
                <img src={conv.participantAvatar} className="w-14 h-14 rounded-full border-2 border-[#1a2e35] shadow-lg" alt="" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a2e35]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-cinzel text-sm text-[#D4AF37] truncate">{conv.participantName}</h4>
                  <span className="text-[10px] text-gray-600">Oggi</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <Skull className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
            <p className="text-gray-600 italic font-cinzel text-xs">Nessun messaggio trovato nel forziere.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
