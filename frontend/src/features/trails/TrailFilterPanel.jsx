import React, { useState, useEffect } from 'react';

const TrailFilterPanel = ({ onApplyFilters, initialValues }) => {
  const [filters, setFilters] = useState(initialValues);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local state when initialValues change
  useEffect(() => {
    setFilters(initialValues);
  }, [initialValues]);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsExpanded(false); // Collapse panel after applying
  };

  const handleResetFilters = () => {
    setFilters(initialValues);
    onApplyFilters(initialValues);
  };

  const difficultyOptions = ['All', 'Easy', 'Moderate', 'Hard', 'Expert'];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header with toggle button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filter Trails</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Content - Always visible on desktop, toggleable on mobile */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block space-y-4`}>
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Trails
          </label>
          <input
            type="text"
            placeholder="Search by name, location..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Max Distance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Distance: {filters.maxDistance}km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={filters.maxDistance}
              onChange={(e) => handleInputChange('maxDistance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>

          {/* Max Elevation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Elevation: {filters.maxElevation}m
            </label>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={filters.maxElevation}
              onChange={(e) => handleInputChange('maxElevation', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0m</span>
              <span>3000m</span>
            </div>
          </div>

          {/* Max Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Duration: {filters.maxDuration}h
            </label>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={filters.maxDuration}
              onChange={(e) => handleInputChange('maxDuration', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficultyOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Reset Filters
          </button>
        </div>

        {/* Active Filters Summary */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
              </span>
            )}
            {filters.difficulty !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {filters.difficulty}
              </span>
            )}
            {filters.maxDistance < 50 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                ≤ {filters.maxDistance}km
              </span>
            )}
            {filters.maxElevation < 3000 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                ≤ {filters.maxElevation}m elevation
              </span>
            )}
            {filters.maxDuration < 12 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ≤ {filters.maxDuration}h
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default TrailFilterPanel;