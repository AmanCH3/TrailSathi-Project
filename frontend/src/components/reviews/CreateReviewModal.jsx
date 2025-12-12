import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReviewApi } from '@/api/reviewApi';
import { toast } from 'react-toastify';

export function CreateReviewModal({ trailId, children }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const createReviewMutation = useMutation({
    mutationFn: (formData) => createReviewApi(trailId, formData),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setOpen(false);
      setRating(0);
      setReviewText('');
      setImages([]);
      setPreviewUrls([]);
      queryClient.invalidateQueries(['trail', trailId]); // Refresh trail data
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review.");
      return;
    }

    const formData = new FormData();
    formData.append('review', reviewText);
    formData.append('rating', rating);
    images.forEach((image) => {
      formData.append('images', image);
    });

    createReviewMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">How was your hike?</DialogTitle>
          <div className="text-center text-gray-500 text-sm mt-1">Share your experience with the community</div>
        </DialogHeader>

        <div className="px-8 space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-200"
                  } transition-colors duration-200`} 
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Review Text */}
          <div className="relative group">
             <textarea 
               value={reviewText}
               onChange={(e) => setReviewText(e.target.value)}
               placeholder="Tell us about the trail... conditions, difficulty, views?"
               className="w-full min-h-[140px] bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:bg-white transition-all resize-none placeholder:text-gray-400"
             />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
             <input 
               type="file" 
               multiple 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleFileChange}
             />
             
             {/* Upload Button Area */}
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 shrink-0 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all gap-1 group"
                >
                    <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-[10px] font-semibold">Add Photo</span>
                </button>

                {previewUrls.map((url, idx) => (
                    <div key={idx} className="w-20 h-20 shrink-0 relative group rounded-2xl overflow-hidden shadow-sm">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
             </div>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-4">
           <div className="flex w-full gap-3">
             <DialogClose asChild>
                <Button variant="ghost" className="flex-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                    Cancel
                </Button>
             </DialogClose>
             <Button 
                onClick={handleSubmit} 
                className="flex-1 rounded-full bg-black text-white hover:bg-gray-800 shadow-lg disabled:opacity-70"
                disabled={createReviewMutation.isPending || rating === 0}
             >
                {createReviewMutation.isPending ? "Posting..." : "Post Review"}
             </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
