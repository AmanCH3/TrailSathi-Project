import { useState } from 'react';
import { Filter } from 'lucide-react';
import { SearchInput } from '../ui/SearchInput';
import { Button } from '../ui/Button';

export const GroupFilters = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [privacy, setPrivacy] = useState('all');
  const [location, setLocation] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFilterChange({ search: value });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handlePrivacyChange = (value) => {
    setPrivacy(value);
    onFilterChange({ privacy: value === 'all' ? '' : value });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    onFilterChange({ location: value });
  };

  const clearFilters = () => {
    setSearch('');
    setPrivacy('all');
    setLocation('');
    onFilterChange({ search: '', privacy: '', location: '' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <SearchInput
            placeholder="Search groups by name or location..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Privacy Filter */}
        <div>
          <select
            value={privacy}
            onChange={(e) => handlePrivacyChange(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="all">All Groups</option>
            <option value="public">Public Only</option>
            <option value="private">Private Only</option>
          </select>
        </div>

        {/* Location Filter (Optional) */}
        {/* <div>
          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={handleLocationChange}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div> */}
      </div>

      {(search || privacy !== 'all' || location) && (
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
