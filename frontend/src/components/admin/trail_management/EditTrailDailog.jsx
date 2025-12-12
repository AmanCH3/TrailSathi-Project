import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export function EditTrailDialog({ open, onOpenChange, trail, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trail) {
      setFormData({
        name: trail.name || "",
        location: trail.location || "",
        difficult: trail.difficult || "Easy",
        distance: trail.distance || "",
        elevation: trail.elevation || "",
        description: trail.description || "",
        duration_min: trail.duration?.min || "",
        duration_max: trail.duration?.max || "",
        features: Array.isArray(trail.features) ? trail.features.join(", ") : "",
        seasons: Array.isArray(trail.seasons) ? trail.seasons.join(", ") : "",
      });
    }
  }, [trail]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      ...formData,
      duration: {
        min: formData.duration_min,
        max: formData.duration_max,
      },
      features: formData.features.split(",").map((f) => f.trim()),
      seasons: formData.seasons.split(",").map((s) => s.trim()),
    };

    delete updatedData.duration_min;
    delete updatedData.duration_max;

    try {
    await onUpdate(trail._id, updatedData);
    toast.success("Trail updated successfully!"); 
    onOpenChange(false);
  } catch (err) {
    console.error("Failed to update trail:", err);
    toast.error("Update failed. Please try again."); 
  } finally {
    setLoading(false);
  }
};

  if (!trail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trail</DialogTitle>
          <DialogDescription>Update trail details and features.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Trail Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficult">Difficulty</Label>
              <Select
                value={formData.difficult}
                onValueChange={(value) => handleSelectChange("difficult", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Difficult">Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="distance">Distance (km)</Label>
              <Input id="distance" type="number" value={formData.distance} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="elevation">Elevation (m)</Label>
              <Input id="elevation" type="number" value={formData.elevation} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_min">Min Duration (hours)</Label>
              <Input
                id="duration_min"
                type="number"
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
                placeholder="e.g., 6"
                value={formData.duration_max}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} rows={4} />
          </div>

          <div>
            <Label htmlFor="features">Key Features (comma-separated)</Label>
            <Textarea id="features" value={formData.features} onChange={handleChange} rows={2} />
          </div>

          <div>
            <Label htmlFor="seasons">Best Seasons (comma-separated)</Label>
            <Input id="seasons" value={formData.seasons} onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Trail"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
