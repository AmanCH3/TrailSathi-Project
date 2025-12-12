
import React, { useState } from 'react';
import { useAdminTrail } from '../hooks/admin/useAdminTrail';
import TrailFilterPanel from '../features/trails/TrailFilterPanel';
import { Button } from '@/components/ui/button';
import { JoinTrailDialog } from '../components/trails/JoinTrailDialog';

const initialFilters = {
  page: 1,
  limit: 10,
  search: '',
  maxDistance: 50,
  maxElevation: 5000,
  maxDuration: 24,
  difficulty: 'All',
};

const TrailCard = ({ trail, onJoinClick }) => {
  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder.svg";
    const apiUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5050';
    return `${apiUrl}/${path.replace(/\\/g, '/')}`;
  };

  const imageUrl = getFullImageUrl(trail.images?.[0]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'difficult': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (duration) => {
    if (duration?.min && duration?.max) return `${duration.min}-${duration.max}h`;
    if (duration?.min) return `${duration.min}h+`;
    if (duration?.max) return `Up to ${duration.max}h`;
    return 'Duration varies';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
  };

  const getSeasonEmoji = (season) => {
    switch (season?.toLowerCase()) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'fall': case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌿';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100">
        <img
          src={imageUrl}
          alt={trail.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg"; }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(trail.difficult)}`}>
            {trail.difficult || 'Unknown'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1">{trail.name}</h3>
          {trail.location && (
            <p className="text-gray-600 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
              {trail.location}
            </p>
          )}
        </div>
        {trail.description && (<p className="text-gray-700 text-sm mb-4 line-clamp-2">{trail.description}</p>)}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="font-bold text-lg text-blue-600">{trail.distance || 'N/A'}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Distance (km)</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-600">{trail.elevation || 'N/A'}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Elevation (m)</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-purple-600">{formatDuration(trail.duration)}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Duration</div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className="flex">{renderStars(trail.averageRating)}</div>
            <span className="text-sm text-gray-600 ml-2">{trail.averageRating?.toFixed(1) || 'No rating'}</span>
          </div>
          <span className="text-xs text-gray-500">{trail.numRatings || 0} review{(trail.numRatings || 0) !== 1 ? 's' : ''}</span>
        </div>
        {trail.seasons?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Best Seasons</p>
            <div className="flex flex-wrap gap-2">
              {trail.seasons.map((season, index) => (
                <span key={index} className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200">
                  <span className="mr-1">{getSeasonEmoji(season)}</span>{season}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onJoinClick?.(trail)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Join Hike
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            View Details
          </button>
        </div>
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

export default function TrailListPage() {
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const { data, isLoading, isError, error } = useAdminTrail(activeFilters);
  const [trailToJoin, setTrailToJoin] = useState(null);

  const trails = data?.data || [];
  const pagination = data?.pagination || {};

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
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Loading trails...</p>
            </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trails.map(trail => (
                    <TrailCard key={trail._id} trail={trail} onJoinClick={setTrailToJoin} />
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
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
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
