import React, { useState, useEffect, useRef } from 'react';

interface Post {
  property_name: string;
  content: string;
  created_at: string;
  scheduled_time: string | null;
  status: 'pending' | 'ready';
  image_urls: string[];
}

export default function SocialMediaManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Új poszt űrlap adatai
  const [newPost, setNewPost] = useState({
    property_type: '',
    location: '',
    size: '',
    rooms: '',
    price: '',
    special_features: '',
    property_name: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Posztok betöltése az API-ról
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/veyron/social-media');
        
        if (!response.ok) {
          throw new Error('Nem sikerült betölteni a posztokat');
        }
        
        const data = await response.json();
        setPosts(data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error('Hiba a posztok betöltésekor:', err);
        setError('Nem sikerült betölteni a posztokat');
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Űrlap mezők változásának kezelése
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value
    });
  };

  // Képfeltöltés kezelése
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // Képek feltöltése ImgBB-re
  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/veyron/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Hiba történt a kép feltöltése során: ${file.name}`);
        }
        
        const data = await response.json();
        uploadedUrls.push(data.url);
      }
      
      setUploadedImageUrls(uploadedUrls);
      return uploadedUrls;
    } catch (err) {
      console.error('Hiba a képek feltöltésekor:', err);
      alert('Hiba történt a képek feltöltése során');
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  // Új poszt létrehozása
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!newPost.property_type || !newPost.location || !newPost.size || 
        !newPost.rooms || !newPost.price || !newPost.property_name) {
      alert('Kérjük, töltsd ki az összes kötelező mezőt!');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Először feltöltjük a képeket
      const imageUrls = await uploadImages();
      
      // API hívás az új poszt generálásához
      const response = await fetch('/api/veyron/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPost,
          image_urls: imageUrls
        }),
      });
      
      if (!response.ok) {
        throw new Error('Hiba történt a poszt generálása során');
      }
      
      const result = await response.json();
      
      // Frissítjük a posztok listáját
      setPosts(prev => [...prev, result.post]);
      
      // Űrlap alaphelyzetbe állítása
      setNewPost({
        property_type: '',
        location: '',
        size: '',
        rooms: '',
        price: '',
        special_features: '',
        property_name: '',
      });
      
      // Képek törlése
      setSelectedFiles([]);
      setUploadedImageUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      alert('A poszt sikeresen létrehozva!');
    } catch (err) {
      console.error('Hiba a poszt létrehozásakor:', err);
      alert('Hiba történt a poszt létrehozása során');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-dark-surface p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Ingatlan Poszt Generátora</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ingatlan neve*:</label>
            <input
              type="text"
              name="property_name"
              value={newPost.property_name}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. Rózsadomb Villa"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ingatlan típusa*:</label>
            <input
              type="text"
              name="property_type"
              value={newPost.property_type}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. villa, lakás"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Helyszín*:</label>
            <input
              type="text"
              name="location"
              value={newPost.location}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. Budapest, XIII. kerület"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Méret*:</label>
            <input
              type="text"
              name="size"
              value={newPost.size}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. 120 m²"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Szobák*:</label>
            <input
              type="text"
              name="rooms"
              value={newPost.rooms}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. 3 szoba + nappali"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ár*:</label>
            <input
              type="text"
              name="price"
              value={newPost.price}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. 120 000 000 Ft"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Különleges jellemzők:</label>
          <textarea
            name="special_features"
            value={newPost.special_features}
            onChange={handleInputChange}
            className="bg-gray-800 border border-gray-700 rounded w-full p-2 min-h-[100px]"
            placeholder="pl. medence, kert, panoráma kilátás, okosotthon"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Képek feltöltése:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="bg-gray-800 border border-gray-700 rounded w-full p-2"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              {selectedFiles.length} kép kiválasztva
            </div>
          )}
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Előnézet ${index + 1}`}
                  className="h-24 w-auto object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = [...selectedFiles];
                    newFiles.splice(index, 1);
                    setSelectedFiles(newFiles);
                  }}
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`w-full py-3 rounded bg-accent hover:bg-opacity-90 transition-colors ${
              (isSubmitting || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting || isUploading ? 'Folyamatban...' : 'Poszt Szöveg Generálása'}
          </button>
        </div>
      </form>
      
      {/* Generált poszt megjelenítése */}
      {posts.length > 0 && (
        <div className="mt-10 mb-10 border border-gray-700 rounded-lg p-6 bg-gray-800/30">
          <h3 className="text-xl font-semibold mb-4">Generált poszt</h3>
          {posts.map((post, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{post.property_name}</h4>
              </div>
              
              <p className="whitespace-pre-wrap mb-4 text-gray-200">{post.content}</p>
              
              {post.image_urls && post.image_urls.length > 0 && (
                <div className="mb-4 flex gap-2 overflow-x-auto py-2">
                  {post.image_urls.map((url, i) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" key={i}>
                      <img 
                        src={url} 
                        alt={`Kép ${i+1}`} 
                        className="h-24 w-auto object-cover rounded"
                      />
                    </a>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>Létrehozva: {new Date(post.created_at).toLocaleString('hu-HU')}</span>
                <span>Státusz: {post.status === 'ready' ? 'Kész' : 'Függőben'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 