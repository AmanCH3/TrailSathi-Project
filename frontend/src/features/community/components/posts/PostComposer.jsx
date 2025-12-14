import { useState } from 'react';
import { Image, MapPin, Send, Smile, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const PostComposer = ({ onSubmit, isSubmitting, currentUser }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to get user info
  const userAvatar = currentUser?.avatar || localStorage.getItem('user_avatar');
  const userName = currentUser?.name || localStorage.getItem('user_name') || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        setImages(prev => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        setIsExpanded(true);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append('content', text);
    images.forEach((image) => {
      formData.append('images', image);
    });

    await onSubmit(formData);
    
    // Reset form
    setText('');
    setImages([]);
    setPreviews([]);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
             {userAvatar && userAvatar !== 'undefined' ? (
                 <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold">
                     {userInitial}
                 </div>
             )}
        </div>

        {/* Input Area */}
        <div className="flex-1">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onClick={() => setIsExpanded(true)}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`What's on your mind, ${userName.split(' ')[0]}?`}
                    className={`w-full bg-gray-50/50 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 resize-none transition-all ${isExpanded ? 'min-h-[120px] bg-transparent' : 'h-11 overflow-hidden'}`}
                />

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 mb-2">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 group">
                                <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Divider */}
                {isExpanded && <div className="h-px bg-gray-100 my-3" />}

                {/* Actions Bar */}
                <div className={`flex items-center justify-between mt-2 ${!isExpanded ? 'hidden' : 'flex'}`}>
                    <div className="flex items-center gap-1">
                        <p className="text-xs font-semibold text-gray-500 mr-2 md:block hidden">Add to your post</p>
                        
                        <label className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full cursor-pointer transition-colors" title="Photo/Video">
                            <Image className="w-5 h-5" />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        
                        <button type="button" className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Tag People">
                            <MapPin className="w-5 h-5" />
                        </button>
                        
                        <button type="button" className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors" title="Feeling/Activity">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={(!text.trim() && images.length === 0) || isSubmitting}
                        className={`px-8 rounded-lg ${(!text.trim() && images.length === 0) ? 'bg-gray-100 text-gray-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

