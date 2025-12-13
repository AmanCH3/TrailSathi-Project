import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, X } from "lucide-react";
import { useCreateTrail } from "../../../hooks/admin/useAdminTrail";
import { toast, ToastContainer } from "react-toastify";

const INITIAL_FORM_STATE = {
  name: "",
  location: "",
  difficult: "Easy",
  duration_min: "", 
  duration_max: "", 
  distance: "",
  elevation: "",
  description: "",
  features: "", 
  seasons: "", 
};

export function CreateTrailDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { mutate: createTrail, isLoading, isError } = useCreateTrail();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (5MB each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    setImageFiles((prevFiles) => [...prevFiles, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    // Clean up URL object to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.location || !formData.distance) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submissionData = new FormData();

    // Append basic fields
    submissionData.append("name", formData.name);
    submissionData.append("location", formData.location);
    submissionData.append("difficult", formData.difficult);
    submissionData.append("distance", formData.distance);
    submissionData.append("elevation", formData.elevation);
    submissionData.append("description", formData.description);

    // Handle duration object
    if (formData.duration_min || formData.duration_max) {
      if (formData.duration_min) submissionData.append("duration[min]", formData.duration_min);
      if (formData.duration_max) submissionData.append("duration[max]", formData.duration_max);
    }

    // Handle features array
    if (formData.features) {
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
      featuresArray.forEach(feature => {
        submissionData.append("features[]", feature);
      });
    }

    // Handle seasons array
    if (formData.seasons) {
      const seasonsArray = formData.seasons.split(',').map(s => s.trim()).filter(s => s);
      seasonsArray.forEach(season => {
        submissionData.append("seasons[]", season);
      });
    }

    // Append all image files with the same field name 'images'
    imageFiles.forEach((file) => {
      submissionData.append("images", file);
    });

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of submissionData.entries()) {
      console.log(key, value);
    }

    createTrail(submissionData, {
      onSuccess: () => {
        toast.success("Trail created successfully!");
        
        // Clean up URL objects
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        
        // Reset form
        setFormData(INITIAL_FORM_STATE);
        setImageFiles([]);
        setImagePreviews([]);
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Error creating trail:", error);
        toast.error(error?.response?.data?.message || "Failed to create trail");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trail</DialogTitle>
          <DialogDescription>Create a new hiking trail for the platform.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Trail Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="location">Location (Geo-coordinates or City ID) *</Label>
              <Input 
                id="location" 
                type="number" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficult">Difficulty</Label>
              <Select value={formData.difficult} onValueChange={(value) => handleSelectChange('difficult', value)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Difficult">Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input 
                id="distance" 
                type="number" 
                step="0.1"
                value={formData.distance} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="elevation">Elevation (meters)</Label>
              <Input 
                id="elevation" 
                type="number" 
                value={formData.elevation} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="duration_min">Min Duration (hours)</Label>
                <Input 
                  id="duration_min" 
                  type="number" 
                  step="0.5"
                  placeholder="e.g., 4" 
                  value={formData.duration_min} 
                  onChange={handleChange} 
                />
            </div>
            <div>
                <Label htmlFor="duration_max">Max Duration (hours)</Label>
                <Input 
                  id="duration_max" 
                  type="number" 
                  step="0.5"
                  placeholder="e.g., 6" 
                  value={formData.duration_max} 
                  onChange={handleChange} 
                />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              placeholder="Describe the trail, its highlights, and what hikers can expect..."
            />
          </div>
          
          <div>
            <Label htmlFor="features">Key Features (comma-separated)</Label>
            <Textarea 
              id="features" 
              placeholder="e.g., Waterfalls, Viewpoints, Wildlife, Rock formations" 
              value={formData.features} 
              onChange={handleChange} 
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="seasons">Best Seasons (comma-separated)</Label>
            <Input 
              id="seasons" 
              placeholder="e.g., Spring, Summer, Autumn" 
              value={formData.seasons} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <Label>Images (Optional)</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
                <div className="flex text-sm leading-6 text-gray-600">
                  <Label htmlFor="images" className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none hover:text-red-500">
                    <span>Click to upload</span>
                    <Input 
                      id="images" 
                      type="file" 
                      className="sr-only" 
                      multiple 
                      onChange={handleImageChange} 
                      accept="image/*"
                    />
                  </Label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB each</p>
              </div>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(index)} 
                    className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center -mt-2 -mr-2 hover:bg-red-600"
                  >
                    <X size={16}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Trail"}
            </Button>
          </div>
        </form>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
}