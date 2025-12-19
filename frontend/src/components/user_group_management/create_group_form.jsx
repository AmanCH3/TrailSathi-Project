"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, MapPin, Hash, Lock, Globe } from "lucide-react";
import { useCreateGroup } from "../../hooks/useGroup";
import { toast } from "react-toastify";

export function CreateGroupForm({ user, onSuccess }) {
  const navigate = useNavigate();
  const { mutate: createGroup, isPending: isLoading } = useCreateGroup();

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    privacy: "public",
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (value) => {
    setFormData((prev) => ({ ...prev, privacy: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
    }
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User must be logged in");
      return;
    }

    if (!formData.name || !formData.description) {
      toast.error("Please fill in the required fields");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("location", formData.location);
    submissionData.append("privacy", formData.privacy);
    
    // Append tags as individual array items if backend expects array, 
    // or as a comma-separated string if backend handles it that way.
    // Mongoose array [String] usually works fine with duplicate keys in FormData in some middlewares,
    // but safer to loop.
    tags.forEach((tag) => submissionData.append("tags[]", tag));

    if (formData.coverImage) {
      submissionData.append("coverImage", formData.coverImage);
    }

    createGroup(submissionData, {
      onSuccess: () => {
        toast.success("Group created successfully!");
        onSuccess?.();
        navigate("/community/groups");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create group");
        console.error(error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Group Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Group Name</Label>
        <Input 
          id="name"
          name="name" 
          placeholder="e.g. Kathmandu Weekend Hikers" 
          value={formData.name} 
          onChange={handleInputChange}
          required 
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          name="description" 
          placeholder="What is this group about?" 
          value={formData.description} 
          onChange={handleInputChange}
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              id="location"
              name="location" 
              placeholder="e.g. Thamel, Kathmandu" 
              value={formData.location} 
              onChange={handleInputChange}
              className="pl-9"
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="space-y-2">
          <Label htmlFor="privacy">Privacy</Label>
          <Select value={formData.privacy} onValueChange={handlePrivacyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> <span>Public</span>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> <span>Private</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tags (e.g. beginner, nature)"
              className="pl-9"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
          </div>
          <Button type="button" onClick={addTag} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1 flex items-center gap-1">
              {tag}
              <X
                className="cursor-pointer w-3 h-3 hover:text-red-500"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
           <Input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {formData.coverImage ? (
             <div className="flex items-center gap-2 text-green-600">
               <Upload className="h-6 w-6" />
               <span className="font-medium">{formData.coverImage.name}</span>
             </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload cover image</p>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? "Creating Group..." : "Create Group"}
        </Button>
      </div>
    </form>
  );
}