
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Camera, MapPin, Ship, X } from 'lucide-react';
import { Post, User } from '../types';
import { apiService } from '../services/apiService';

interface CreatePostProps {
  onPostCreated: () => void;
  currentUser: User;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, currentUser }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (!content && !image) return;
    
    setUploading(true);
    try {
      await apiService.createPost(currentUser.id, content, image || undefined);
      onPostCreated();
    } catch (e) {
      alert("Tempesta in arrivo! Impossibile pubblicare il post.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="animate-fadeIn p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-cinzel text-xl text-[#D4AF37]">Nuovo Bottino</h2>
        <button 
          onClick={handleShare}
          disabled={uploading || (!content && !image)}
          className="text-[#00A3A1] font-bold disabled:opacity-50 transition-opacity"
        >
          {uploading ? 'Inviando...' : 'Condividi'}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#D4AF37]">
          <img src={currentUser.avatar} alt="Tu" className="w-full h-full object-cover" />
        </div>
        <textarea 
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Cosa succede nel mare oggi?"
          className="bg-transparent w-full resize-none outline-none text-lg text-gray-200 min-h-[100px] placeholder:text-gray-600"
        />
      </div>

      {image ? (
        <div className="relative mb-6 rounded-lg overflow-hidden border border-[#00707c]/50">
          <img src={image} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
          <button 
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <div 
            onClick={triggerFileInput}
            className="aspect-square wood-texture border-2 border-dashed border-[#00707c]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all group active:scale-95"
          >
            <ImageIcon className="w-10 h-10 text-gray-500 group-hover:text-[#D4AF37] mb-2" />
            <span className="text-[10px] text-gray-500 font-bold uppercase group-hover:text-[#D4AF37]">Galleria</span>
          </div>
          <div 
            onClick={triggerFileInput}
            className="aspect-square wood-texture border-2 border-dashed border-[#00707c]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all group active:scale-95"
          >
            <Camera className="w-10 h-10 text-gray-500 group-hover:text-[#D4AF37] mb-2" />
            <span className="text-[10px] text-gray-500 font-bold uppercase group-hover:text-[#D4AF37]">Lente</span>
          </div>
        </div>
      )}
      
      {uploading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
           <div className="bg-[#1a2e35] p-6 rounded-lg border-2 border-[#D4AF37] flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mb-4"></div>
              <p className="font-cinzel text-[#D4AF37] animate-pulse">Salvataggio nel forziere...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
