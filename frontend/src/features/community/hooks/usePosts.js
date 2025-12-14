import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../services/postsService';
import { toast } from 'react-toastify';

export const usePosts = (groupId) => {
  return useQuery({
    queryKey: ['posts', groupId],
    queryFn: () => postsService.getPosts(groupId),
    enabled: !!groupId,
    staleTime: 30000,
  });
};

export const useCreatePost = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => postsService.createPost(groupId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', groupId] });
      toast.success('Post created!');
    },
    onError: () => {
      toast.error('Failed to create post.');
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }) =>
      isLiked ? postsService.unlikePost(postId) : postsService.likePost(postId),
    onMutate: async ({ postId, isLiked, groupId }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', groupId] });
      const previousPosts = queryClient.getQueryData(['posts', groupId]);

      queryClient.setQueryData(['posts', groupId], (old) => {
        if (!old?.posts) return old;
        return {
          ...old,
          posts: old.posts.map((p) =>
            p.id === postId || p._id === postId
              ? {
                  ...p,
                  isLiked: !isLiked,
                  likeCount: isLiked ? Math.max(0, (p.likeCount || 0) - 1) : (p.likeCount || 0) + 1,
                }
              : p
          ),
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['posts', variables.groupId], context.previousPosts);
      toast.error('Failed to update like.');
    },
    onSettled: (data, error, variables) => {
    queryClient.invalidateQueries({ queryKey: ['posts', variables.groupId] });
    },
  });
};

export const useComments = (postId) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsService.getComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => postsService.createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      // Also invalidate posts to update comment count if needed
      queryClient.invalidateQueries({ queryKey: ['posts'] }); 
      toast.success('Comment added');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });
};
