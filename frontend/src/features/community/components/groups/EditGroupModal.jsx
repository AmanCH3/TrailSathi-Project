import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useGroups } from '@/features/community/hooks/useGroups'; // Ensure this hook has update method or use plain axios
import axiosInstance from '@/features/community/services/api/axios.config';
import { getAssetUrl } from '@/utils/imagePath';

export const EditGroupModal = ({ isOpen, onClose, group, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    privacy: 'public',
    tags: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (group) {
        setFormData({
            name: group.name || '',
            description: group.description || '',
            location: group.location || '',
            privacy: group.privacy || 'public',
            tags: group.tags ? group.tags.join(', ') : ''
        });
        if (group.coverImage) setCoverPreview(getAssetUrl(group.coverImage));
        if (group.avatar) setAvatarPreview(getAssetUrl(group.avatar));
    }
  }, [group]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'cover') {
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
      } else {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('privacy', formData.privacy);
      
      // Process tags
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      tagsArray.forEach(tag => data.append('tags[]', tag)); // Backend needs to handle array or repeated keys? 
      // Usually express/multer handles `tags` as array if sent multiple times. 
      // But simple way: send JSON for text if not file, but we are mixing.
      // Or just send tags as comma separated string if backend parses it?
      // Group model has tags: [String]. 
      // Let's assume standard FormData array handling.
      // But wait, standard FormData array is: append('tags', val1), append('tags', val2).
      
       tagsArray.forEach(tag => data.append('tags', tag));

      if (coverImage) data.append('coverImage', coverImage);
      if (avatar) data.append('avatar', avatar);

      await axiosInstance.put(`/api/groups/${group.id || group._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update group');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group Settings</DialogTitle>
        </DialogHeader>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Section */}
            <div className="space-y-4">
                <div>
                    <Label>Cover Image</Label>
                    <div className="mt-2 relative h-40 bg-gray-100 rounded-lg overflow-hidden border border-dashed border-gray-300 flex items-center justify-center group">
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span>No cover image</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                            Change Cover
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <div className="relative w-20 h-20 bg-gray-100 rounded-full overflow-hidden border border-gray-200 group">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                        )}
                         <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs">
                            Change
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
                        </label>
                     </div>
                     <div className="flex-1">
                        <Label>Group Icon</Label>
                        <p className="text-sm text-gray-500">Recommended size: 256x256px</p>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Pokhara, Nepal" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select value={formData.privacy} onValueChange={(val) => setFormData(p => ({ ...p, privacy: val }))}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="hiking, mountains, photography" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                           Saving...
                        </>
                    ) : 'Save Changes'}
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
