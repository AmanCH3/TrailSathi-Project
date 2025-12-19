import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';
import { cn } from '@/lib/utils';
import { PostComments } from './PostComments';
import { useLikePost } from '../../hooks/usePosts';
import { getAssetUrl } from '@/utils/imagePath';

export const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const likeMutation = useLikePost();

  const handleLike = () => {
    likeMutation.mutate({
      postId: post.id || post._id,
      isLiked: post.isLiked,
      groupId: post.group?._id || post.group // Pass group ID for invalidation
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {post.author?.avatar && post.author.avatar !== '/default-avatar.jpg' ? (
                <img
                  src={getAssetUrl(post.author.avatar)}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white font-bold text-sm">
                  {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">{post.author?.name || 'Unknown'}</span>
                {post.trailName && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-full font-medium">
                    {post.trailName}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs">{formatTimestamp(post.createdAt)}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {post.content && (
          <p className="text-gray-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
            <img
              src={getAssetUrl(post.images[0])}
              alt="Post content"
              className="w-full h-auto max-h-[500px] object-cover"
            />
             {post.images.length > 1 && (
                <div className="p-2 bg-gray-50 text-center text-xs text-gray-500">
                    +{post.images.length - 1} more photos
                </div>
             )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4">
                <button
                    onClick={handleLike}
                    className={cn(
                    'flex items-center gap-1.5 text-sm transition-colors',
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    )}
                >
                    <Heart className={cn('w-5 h-5', post.isLiked && 'fill-current')} />
                    <span>{post.likesCount || 0}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentsCount || 0}</span>
                </button>
            </div>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <PostComments postId={post.id || post._id} />
      )}
    </div>
  );
};
