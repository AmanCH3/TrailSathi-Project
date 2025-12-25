
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { useAdminTrail } from '../hooks/admin/useAdminTrail';
import TrailFilterPanel from '../features/trails/TrailFilterPanel';
import { Button } from '@/components/ui/button';
import { JoinTrailDialog } from '../components/trails/JoinTrailDialog';
import { HikingLoader } from '../components/common/HikingLoader';

const initialFilters = {
  page: 1,
  limit: 10,
  search: '',
  maxDistance: 50,
  maxElevation: 3000,
  maxDuration: 12,
  difficulty: 'All',
};

const TrailCard = ({ trail, onJoinClick, isJoined }) => {
  const navigate = useNavigate();

  const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop";
    if (path.startsWith('http')) return path; 
    const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:5050';
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  const getDuration = (length) => {
      const hours = length / 3;
      return `${Math.floor(hours)}-${Math.ceil(hours)} hr`;
  };

  return (
    <div 
        className="group flex flex-col gap-3 cursor-pointer"
        onClick={() => navigate(`/trails/${trail._id}`)}
    >
        {/* Image Card */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-gray-100">
              <img 
                src={getFullImageUrl(trail.images?.[0])} 
                alt={trail.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Planned Badge */}
              {isJoined && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm z-10">
                      Planned
                  </div>
              )}
        </div>

        {/* Content */}
        <div className="space-y-1">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 leading-snug truncate">
                {trail.name}
            </h3>
            
            {/* Subtitle / Location */}
            <p className="text-sm text-gray-500 font-medium truncate">
                {trail.location || "Unknown Location"}
            </p>
            
            {/* Meta Row: Rating · Difficulty · Length · Duration */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                <div className="flex items-center gap-0.5 text-gray-900 font-bold">
                    <Star className="w-3 h-3 fill-current" /> 
                    <span>{trail.averageRating?.toFixed(1) || "New"}</span>
                </div>
                <span>·</span>
                <span className={trail.difficulty === 'Hard' ? 'text-red-600' : trail.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}>
                    {trail.difficulty || trail.difficult || 'Moderate'}
                </span>
                <span>·</span>
                <span>{trail.length} km</span>
                <span>·</span>
                <span>Est. {getDuration(trail.length)}</span>
            </div>

            {/* Join Button (Hidden if Joined) */}
            {!isJoined ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onJoinClick?.(trail);
                    }}
                    className="w-full mt-2 bg-black text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                >
                    Join Hike
                </button>
            ) : (
                <div className="w-full mt-2 py-2 text-center text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                   In Your Plans
                </div>
            )}
        </div>
    </div>
  );
};

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) return null;

  const { page: currentPage, totalPages } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} variant="outline">Previous</Button>
      {getPageNumbers().map(page => (
        <Button key={page} onClick={() => onPageChange(page)} variant={page === currentPage ? 'solid' : 'outline'}>
          {page}
        </Button>
      ))}
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} variant="outline">Next</Button>
    </div>
  );
};

import { useUserProfile } from '../hooks/useUserProfile';

export default function TrailListPage() {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const { data: user } = useUserProfile();
  
  // Create effective filters by removing defaults (which imply "all")
  const getEffectiveFilters = () => {
    const filters = { ...activeFilters };
    if (filters.maxDistance >= 50) delete filters.maxDistance;
    if (filters.maxElevation >= 3000) delete filters.maxElevation; // Slider max is 3000, initial is 5000
    if (filters.maxDuration >= 12) delete filters.maxDuration; // Slider max is 12, initial is 24
    if (filters.difficulty === 'All') delete filters.difficulty;
    if (!filters.search) delete filters.search;
    return filters;
  };

  const { data, trails, isLoading, isError, error } = useAdminTrail(getEffectiveFilters());
  const [trailToJoin, setTrailToJoin] = useState(null);

  const pagination = data?.pagination || {};

  // Debug Logs
  useEffect(() => {
    if (user) {
        console.log("Logged In User:", user);
        console.log("Joined Trails:", user.joinedTrails);
    }
  }, [user]);

  // Check if user has joined a specific trail
  const isTrailJoined = (trailId) => {
    if (!user || !user.joinedTrails) return false;
    return user.joinedTrails.some(jt => {
        // Handle both populated (object) and unpopulated (string) states
        const joinedTrailId = jt.trail?._id || jt.trail;
        return joinedTrailId === trailId;
    });
  };

  const handleApplyFilters = (newFilters) => {
    setActiveFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setActiveFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 z-50 flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Trails</h1>
          <p className="text-gray-600">Find your perfect hiking adventure</p>
        </div>

        <TrailFilterPanel onApplyFilters={handleApplyFilters} initialValues={initialFilters} />

        <div className="mt-8">
          {!isLoading && !isError && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {trails.length} of {pagination.total || 0} trails
              </p>
              {pagination.totalPages > 1 && (
                <p className="text-sm text-gray-500">
                  Page {pagination.page || 1} of {pagination.totalPages || 1}
                </p>
              )}
            </div>
          )}

          {isLoading && (
            <HikingLoader text="Discovering trails" />
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Trails</h3>
              <p className="text-red-600">{error?.message || 'Something went wrong. Please try again.'}</p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {trails.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trails.map(trail => (
                    <TrailCard 
                        key={trail._id} 
                        trail={trail} 
                        onJoinClick={setTrailToJoin} 
                        isJoined={isTrailJoined(trail._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No trails found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              )}
              
              {/* Show More Button */}
              {trails.length < (pagination.total || 0) && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => setActiveFilters(prev => ({ ...prev, limit: prev.limit + 10 }))}
                        className="min-w-[200px]"
                    >
                        Show More
                    </Button>
                  </div>
              )}
            </>
          )}
        </div>
      </div>

      <JoinTrailDialog
        isOpen={!!trailToJoin}
        onOpenChange={() => setTrailToJoin(null)}
        trail={trailToJoin}
      />
    </div>
  );
}
