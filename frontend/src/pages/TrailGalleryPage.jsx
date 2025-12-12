import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getGalleryImagesApi } from '../api/admin/trailApi';
import { useTrail } from '../hooks/useTrail';

export default function TrailGalleryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch Trail Details (for name)
  const { data: trail, isLoading: isTrailLoading } = useTrail(id);
  
  // Fetch Gallery Images
  const { data: galleryData, isLoading: isGalleryLoading } = useQuery({
    queryKey: ['gallery', id],
    queryFn: () => getGalleryImagesApi(id),
  });

  const isLoading = isTrailLoading || isGalleryLoading;
  
  // Helper for duplicate image processing or logic if needed
  const getFullImageUrl = (path) => {
      if (!path) return "/placeholder-trail.jpg";
      if (path.startsWith('http')) return path; 
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5050';
      const cleanPath = path.replace(/\\/g, '/');
      return `${baseUrl}/${cleanPath}`;
  };

  // Aggregate all images
  const allImages = React.useMemo(() => {
    if (!galleryData?.data?.data?.images) return [];
    
    return galleryData.data.data.images.map(img => ({
          url: getFullImageUrl(img.url),
          user: img.user?.name || 'Anonymous', 
          userAvatar: getFullImageUrl(img.user?.profileImage)
    }));
  }, [galleryData]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading gallery...</div>;

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                  <h1 className="text-xl font-bold text-gray-900">{trail?.name || "Trail"} Gallery</h1>
                  <p className="text-sm text-gray-500">{allImages.length} photos</p>
              </div>
          </div>
      </div>

      {/* Gallery Grid (Masonry Effect) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {allImages.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <ImageIcon className="w-8 h-8 opacity-50" />
                 </div>
                 <p>No photos uploaded yet.</p>
                 <button 
                    onClick={() => navigate(-1)} 
                    className="mt-4 text-black underline font-medium"
                 >
                     Go back and upload one
                 </button>
             </div>
        ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {allImages.map((image, idx) => (
                    <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-gray-100">
                        <img 
                          src={image.url} 
                          alt={`Gallery ${idx}`} 
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Overlay with User Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                     {image.userAvatar ? (
                                        <img src={image.userAvatar} alt="User" className="w-full h-full object-cover" />
                                     ) : (
                                        <div className="w-full h-full bg-gray-400" />
                                     )}
                                </div>
                                <span className="text-white text-xs font-medium truncate">{image.user}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
