// src/components/admin/trail_management/ViewTrailDailog.jsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Mountain, Zap, Star } from "lucide-react";

// Helper to get difficulty color (can be moved to a utils file)
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return "bg-gray-100 text-gray-800";
  switch (difficulty.toLowerCase()) {
    case "easy": return "bg-green-100 text-green-800";
    case "moderate": return "bg-yellow-100 text-yellow-800";
    case "difficult": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export function ViewTrailDialog({ open, onOpenChange, trail }) {
  if (!trail) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SERVER_ROOT_URL = API_BASE_URL ? API_BASE_URL.replace('/api', '') : 'http://localhost:5050';

  const getFullImageUrl = (path) => {
    if (!path) {
      return "https://dk2dv4ezy246u.cloudfront.net/widgets/sMRhRDPDTxK7_large.jpg";
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${SERVER_ROOT_URL}/${path.replace(/\\/g, '/')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{trail.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location: {trail.location || 'N/A'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          
          {trail.images && trail.images.length > 0 && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-200">
              <img 
                src={getFullImageUrl(trail.images[0])} 
                alt={trail.name} 
                className="absolute h-full w-full object-cover" 
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Difficulty</Label>
              <Badge className={`mt-1 text-sm ${getDifficultyColor(trail.difficult)}`}>{trail.difficult || 'N/A'}</Badge>
            </div>
             <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" /> Distance</Label>
              <p className="text-lg font-bold">{trail.distance ? `${trail.distance} km` : 'N/A'}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Mountain className="h-3 w-3" /> Elevation</Label>
              <p className="text-lg font-bold">{trail.elevation ? `${trail.elevation} m` : 'N/A'}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Duration</Label>
              <p className="text-lg font-bold">{`${trail.duration?.min || '?'} - ${trail.duration?.max || '?'} hrs`}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-semibold">Description</Label>
            <p className="mt-1 text-muted-foreground text-base">{trail.description || 'No description available.'}</p>
          </div>

          {trail.features && trail.features.length > 0 && (
            <div>
              <Label className="text-sm font-semibold">Features</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {trail.features.map((feature) => (
                  <Badge key={feature} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          )}

          {trail.seasons && trail.seasons.length > 0 && (
            <div>
              <Label className="text-sm font-semibold">Best Seasons</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {trail.seasons.map((season) => (
                  <Badge key={season} variant="outline">{season}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* --- JOIN BUTTON ADDED --- */}
        <DialogFooter>
            <Button className="w-full" onClick={() => alert('Join Trail Logic Here!')}>Join Here</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}