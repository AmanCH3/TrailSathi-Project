import { QueryClient } from '@tanstack/react-query';

export const communityQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
