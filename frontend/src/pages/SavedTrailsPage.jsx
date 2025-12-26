import React from 'react';
import { useSavedTrails } from '../context/SavedTrailsContext';
import { Bookmark, X, Mountain, Star, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SavedTrailsPage() {
  const { savedTrails, unsaveTrail } = useSavedTrails();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

  const getFullImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop";
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${API_BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

  const getDuration = (length) => {
    const hours = length / 3;
    return `${Math.floor(hours)}-${Math.ceil(hours)} hr`;
  };

  if (savedTrails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-6">
              <Bookmark className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Saved Trails Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring trails and save your favorites to find them quickly later!
            </p>
            <button
              onClick={() => navigate('/trails')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Trails
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-green-600 fill-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Saved Trails</h1>
          </div>
          <p className="text-gray-600">
            {savedTrails.length} {savedTrails.length === 1 ? 'trail' : 'trails'} saved
          </p>
        </div>

        {/* Trails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedTrails.map((trail) => (
            <div key={trail._id} className="group relative">
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/trails/${trail._id}`)}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 mb-3">
                  <img
                    src={getFullImageUrl(trail.images?.[0])}
                    alt={trail.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unsaveTrail(trail._id);
                    }}
                    className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm z-20"
                    aria-label="Remove from saved"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 leading-snug truncate">
                    {trail.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 font-medium truncate">
                    {trail.location || "Unknown Location"}
                  </p>
                  
                  {/* Meta Row */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                    <div className="flex items-center gap-0.5 text-gray-900 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{trail.ratingsAverage?.toFixed(1) || "New"}</span>
                    </div>
                    <span>·</span>
                    <span className={trail.difficulty === 'Hard' ? 'text-red-600' : trail.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}>
                      {trail.difficulty}
                    </span>
                    <span>·</span>
                    <span>{trail.length} km</span>
                    <span>·</span>
                    <span>Est. {getDuration(trail.length)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
