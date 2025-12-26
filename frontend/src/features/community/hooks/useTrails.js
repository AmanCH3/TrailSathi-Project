import { useQuery } from '@tanstack/react-query';
import { trailsService } from '../services/trailsService';

export const useTrailSearch = (query) => {
  return useQuery({
    queryKey: ['trails', 'search', query],
    queryFn: () => trailsService.searchTrails(query),
    enabled: !!query && query.length > 2, // Only search if query has 3+ chars
    staleTime: 60000,
  });
};
