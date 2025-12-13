import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

// Placeholder data - replace with real data or images
const galleryItems = [
  { id: 1, user: '@adventure_alex', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, user: '@hiker_sarah', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1000&auto=format&fit=crop' },
  { id: 3, user: '@mountain_mike', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000&auto=format&fit=crop' },
  { id: 4, user: '@trail_blazer', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop' },
];

const CommunityGallery = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Share your next adventure
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Show us how you <span className="font-semibold text-gray-900">#HikeOurTrails</span> by tagging us <span className="font-semibold text-gray-900">@TrailSathi</span> for a chance to be featured!
            </p>
          </div>
          <div className="flex gap-2 text-gray-400">
             <Instagram className="w-6 h-6 hover:text-pink-600 transition-colors cursor-pointer" />
             <Twitter className="w-6 h-6 hover:text-blue-400 transition-colors cursor-pointer" />
             <Facebook className="w-6 h-6 hover:text-blue-600 transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-2xl aspect-square cursor-pointer">
              <img 
                src={item.image} 
                alt={`Adventure by ${item.user}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium text-sm">{item.user}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows (Visual only for now since it's a grid, but screenshot shows horizontal scroll arrows) */}
        <div className="mt-8 flex gap-2">
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
             {/* Note: Screenshot showed arrow on the LEFT for gallery? Actually screenshot shows arrows on sides or bottom. I'll put a 'Next' arrow too if needed, but a simple grid is cleaner. The screenshot has a left arrow button below the images. */}
        </div>
      </div>
    </section>
  );
};

export default CommunityGallery;
