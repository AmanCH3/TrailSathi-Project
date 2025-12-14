import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService } from '../services/groupsService';
import { toast } from 'react-toastify';

export const useGroups = (filters = {}) => {
  return useQuery({
    queryKey: ['groups', filters],
    queryFn: () => groupsService.getGroups(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useGroupDetail = (groupId) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupsService.getGroupDetail(groupId),
    enabled: !!groupId,
    staleTime: 60000,
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupsService.joinGroup,
    onMutate: async (groupId) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      await queryClient.cancelQueries({ queryKey: ['group', groupId] });

      const previousGroups = queryClient.getQueryData(['groups']);
      const previousGroup = queryClient.getQueryData(['group', groupId]);

      // Optimistically update groups list
      queryClient.setQueryData(['groups'], (old) => {
        if (!old?.groups) return old;
        return {
          ...old,
          groups: old.groups.map((g) =>
            g.id === groupId || g._id === groupId
              ? { ...g, isMember: true, memberCount: (g.memberCount || 0) + 1 }
              : g
          ),
        };
      });

      // Optimistically update group detail
queryClient.setQueryData(['group', groupId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isMember: true,
          memberCount: (old.memberCount || 0) + 1,
        };
      });

      return { previousGroups, previousGroup };
    },
    onError: (err, groupId, context) => {
      queryClient.setQueryData(['groups'], context.previousGroups);
      queryClient.setQueryData(['group', groupId], context.previousGroup);
      toast.error('Failed to join group. Please try again.');
    },
    onSuccess: () => {
      toast.success('Successfully joined the group!');
    },
    onSettled: (data, error, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
};

export const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupsService.leaveGroup,
    onMutate: async (groupId) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      await queryClient.cancelQueries({ queryKey: ['group', groupId] });

      const previousGroups = queryClient.getQueryData(['groups']);
      const previousGroup = queryClient.getQueryData(['group', groupId]);

      queryClient.setQueryData(['groups'], (old) => {
        if (!old?.groups) return old;
        return {
          ...old,
          groups: old.groups.map((g) =>
            g.id === groupId || g._id === groupId
              ? { ...g, isMember: false, memberCount: Math.max(0, (g.memberCount || 0) - 1) }
              : g
          ),
        };
      });

      queryClient.setQueryData(['group', groupId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isMember: false,
          memberCount: Math.max(0, (old.memberCount || 0) - 1),
        };
      });

      return { previousGroups, previousGroup };
    },
    onError: (err, groupId, context) => {
      queryClient.setQueryData(['groups'], context.previousGroups);
      queryClient.setQueryData(['group', groupId], context.previousGroup);
      toast.error('Failed to leave group.');
    },
    onSuccess: () => {
      toast.success('Left the group.');
    },
    onSettled: (data, error, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });
};

export const useMembers = (groupId, search = '') => {
  return useQuery({
    queryKey: ['members', groupId, search],
    queryFn: () => groupsService.getMembers(groupId, search),
    enabled: !!groupId,
    staleTime: 30000,
  });
};
