import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react'; // Added icons
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadGalleryImagesApi } from '@/api/admin/trailApi';
import { toast } from 'react-toastify';

export function UploadPhotosModal({ trailId, children }) {
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

  const uploadMutation = useMutation({
    mutationFn: (formData) => uploadGalleryImagesApi(trailId, formData),
    onSuccess: () => {
      toast.success("Photos uploaded to gallery!");
      setOpen(false);
      setImages([]);
      setPreviewUrls([]);
      // Invalidate queries to refresh gallery
      queryClient.invalidateQueries(['gallery', trailId]);
    },
    onError: (error) => {
      console.error("Upload Failed Details:", error);
      console.error("Response:", error.response);
      toast.error(error.response?.data?.message || "Failed to upload photos (Check Console)");
    }
  });

  const handleSubmit = () => {
    if (images.length === 0) {
      toast.error("Please select at least one photo.");
      return;
    }
    
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    uploadMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-lg shadow-xl p-0 overflow-hidden border-0">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-gray-900">Upload photos</h2>
            <DialogClose className="opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500">
                <X className="h-5 w-5 text-gray-500" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </div>

        <div className="px-6 py-4">
            
            {/* Dropzone Area */}
            {images.length === 0 ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] bg-gray-50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                >
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                             <Upload className="w-5 h-5 text-black" />
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                            Drag photos here or <span className="underline cursor-pointer">browse files</span>
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            PNG, JPG or JPEG
                        </p>
                    </div>
                </div>
            ) : (
                /* Preview Grid */
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                    {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {/* Add more button */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 border border-dashed border-gray-300"
                    >
                        <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            )}
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
            />

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
             <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full border-gray-300 hover:bg-gray-100">
                 Cancel
             </Button>
             <Button 
                onClick={handleSubmit} 
                disabled={uploadMutation.isPending || images.length === 0}
                className="rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
                 {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
             </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
