import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SearchInput = ({ placeholder, value, onChange, className, ...props }) => (
  <div className={cn('relative', className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder || 'Search...'}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
      {...props}
    />
  </div>
);
