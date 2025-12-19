import { useState } from 'react';
import { useComments, useCreateComment } from '../../hooks/usePosts';
import { Skeleton } from '../ui/Skeleton';
import { Send, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const PostComments = ({ postId }) => {
  const [content, setContent] = useState('');
  const { data: commentsData, isLoading } = useComments(postId);
  const createCommentMutation = useCreateComment(postId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createCommentMutation.mutateAsync(content);
    setContent('');
  };

  const comments = commentsData?.comments || [];

  return (
    <div className="bg-gray-50/50 rounded-b-2xl border-t border-gray-100 p-4 space-y-4">
      {/* Comment List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
             <Skeleton className="h-10 w-3/4 rounded-lg" />
             <Skeleton className="h-10 w-1/2 rounded-lg" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id || comment._id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-gray-200">
                {comment.author?.profileImage ? (
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2 inline-block shadow-sm">
                  <span className="font-semibold text-xs text-gray-900 block mb-0.5">
                    {comment.author?.name || 'Unknown User'}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
                {/* Optional: Time ago */}
                {/* <p className="text-xs text-gray-400 mt-1 ml-2">2h ago</p> */}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 py-2">No comments yet. Be the first!</p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-white border border-gray-200 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-400"
          disabled={createCommentMutation.isPending}
        />
        <Button
            type="submit"
            size="sm"
            variant="ghost"
            className={`rounded-full w-9 h-9 p-0 flex items-center justify-center transition-all ${content.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'text-gray-400 hover:bg-gray-100'}`}
            disabled={!content.trim() || createCommentMutation.isPending}
        >
             <Send className="w-4 h-4 ml-0.5" />
        </Button>
      </form>
    </div>
  );
};
