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
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [webhookSent, setWebhookSent] = useState(false);
  
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
      setGeneratedPost(null); // Töröljük a korábbi generált posztot
      setWebhookSent(false); // Alaphelyzetbe állítjuk a webhook küldés állapotát
      
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
      
      // Beállítjuk a generált posztot
      setGeneratedPost(result.post);
      
      // NEM frissítjük a posztok listáját, mert már elmentette a PostPublisher
      // NEM állítjuk alaphelyzetbe az űrlapot, mert lehet, hogy el akarja küldeni a webhookra
      
    } catch (err) {
      console.error('Hiba a poszt létrehozásakor:', err);
      alert('Hiba történt a poszt létrehozása során');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Poszt küldése a webhookra
  const sendToWebhook = async () => {
    if (!generatedPost || isSendingToWebhook) return;
    
    try {
      setIsSendingToWebhook(true);
      
      // Hashtagek kinyerése a posztból
      const hashtagRegex = /#\w+/g;
      const hashtagMatches = generatedPost.content.match(hashtagRegex) || [];
      const hashtags = hashtagMatches.join(' ');
      
      // Hashtagek eltávolítása a tartalomból
      const contentWithoutHashtags = generatedPost.content.replace(hashtagRegex, '').trim();
      
      // Képek darabszáma
      const imageCount = generatedPost.image_urls.length;
      
      // Képek előkészítése kep1-kep9 változókba
      const kepObj: Record<string, string> = {};
      for (let i = 1; i <= 9; i++) {
        const key = `kep${i}`;
        kepObj[key] = i <= generatedPost.image_urls.length ? generatedPost.image_urls[i-1] : "";
      }
      
      const response = await fetch('/api/veyron/social-media/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_content: contentWithoutHashtags,
          property_name: generatedPost.property_name,
          hashtags,
          image_count: imageCount,
          ...kepObj  // kep1, kep2, ..., kep9 változók
        }),
      });
      
      if (!response.ok) {
        throw new Error('Hiba történt a poszt webhookra küldése során');
      }
      
      const result = await response.json();
      
      // Jelezzük, hogy a webhook küldés sikeres volt
      setWebhookSent(true);
      
      // Most már alaphelyzetbe állíthatjuk az űrlapot
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
      
      alert('A poszt sikeresen elküldve a webhookra!');
    } catch (err) {
      console.error('Hiba a webhook küldésekor:', err);
      alert('Hiba történt a webhook küldése során');
    } finally {
      setIsSendingToWebhook(false);
    }
  };
  
  // Űrlap törlése
  const resetForm = () => {
    setNewPost({
      property_type: '',
      location: '',
      size: '',
      rooms: '',
      price: '',
      special_features: '',
      property_name: '',
    });
    setSelectedFiles([]);
    setUploadedImageUrls([]);
    setGeneratedPost(null);
    setWebhookSent(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="bg-dark-surface p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Ingatlan Poszt Generátora</h2>
      
      {/* Generált poszt megjelenítése */}
      {generatedPost && (
        <div className="mb-8 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-3">Generált poszt</h3>
          <div className="whitespace-pre-wrap mb-4">{generatedPost.content}</div>
          
          {generatedPost.image_urls.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Képek:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {generatedPost.image_urls.map((url, index) => (
                  <img key={index} src={url} alt={`Ingatlan kép ${index + 1}`} className="w-full h-32 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 mt-4">
            <button
              type="button"
              onClick={sendToWebhook}
              disabled={isSendingToWebhook || webhookSent}
              className={`px-4 py-2 rounded font-medium ${
                webhookSent 
                  ? 'bg-green-700 text-white cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSendingToWebhook 
                ? 'Küldés...' 
                : webhookSent 
                  ? 'Elküldve' 
                  : 'Küldés a webhookra'}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium"
            >
              Új poszt készítése
            </button>
          </div>
        </div>
      )}
      
      {/* Poszt létrehozása űrlap - csak akkor jelenítjük meg, ha nincs generált poszt vagy új posztot akarunk készíteni */}
      {!generatedPost && (
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
                placeholder="pl. 75 000 000 Ft"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Különleges jellemzők (opcionális):</label>
            <input
              type="text"
              name="special_features"
              value={newPost.special_features}
              onChange={handleInputChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              placeholder="pl. medence, kert, panoráma"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Képek feltöltése:</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="bg-gray-800 border border-gray-700 rounded w-full p-2"
              multiple
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`px-6 py-2 rounded font-medium ${
                isSubmitting || isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSubmitting ? 'Generálás folyamatban...' : 'Poszt generálása'}
            </button>
          </div>
        </form>
      )}
      
      {/* Korábbi posztok listája */}
      {posts.length > 0 && !generatedPost && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Korábbi posztok</h3>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold mb-2">{post.property_name}</h4>
                <div className="whitespace-pre-wrap mb-3 text-sm">{post.content}</div>
                
                {post.image_urls.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-xs font-medium mb-1">Képek:</h5>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {post.image_urls.map((url, i) => (
                        <img key={i} src={url} alt={`Kép ${i + 1}`} className="h-16 w-auto object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  <span>Létrehozva: {new Date(post.created_at).toLocaleString('hu-HU')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 