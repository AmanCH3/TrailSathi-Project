// src/components/admin/trail_management/TrailCard.jsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, MapPin, Clock, Mountain, Star, Zap } from "lucide-react";

// Helper to get difficulty color
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return "bg-gray-100 text-gray-800";
  switch (difficulty.toLowerCase()) {
    case "easy": return "bg-green-100 text-green-800";
    case "moderate": return "bg-yellow-100 text-yellow-800";
    case "difficult": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export function TrailCard({ trail, onView, onEdit, onDelete }) {
  if (!trail) return null;

  // --- FIX IS HERE ---
  // This logic correctly constructs the full image URL from the relative path.
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SERVER_ROOT_URL = API_BASE_URL ? API_BASE_URL.replace('/api', '') : 'http://localhost:5050';

  const getFullImageUrl = (path) => {
    if (!path) {
      // Return a default placeholder if no image is available
      return "https://dk2dv4ezy246u.cloudfront.net/widgets/sMRhRDPDTxK7_large.jpg";
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Prepend the server's root URL to the relative path
    return `${SERVER_ROOT_URL}/${path.replace(/\\/g, '/')}`;
  };

  const imageUrl = getFullImageUrl(trail.images?.[0]);
  // --- END OF FIX ---

  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={trail.name} 
          className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <CardTitle className="text-lg line-clamp-1">{trail.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {trail.location || 'N/A'}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(trail)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(trail)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(trail)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-2">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{trail.description || 'No description.'}</p>
        
        <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Difficulty:</span>
              <Badge className={`text-xs ${getDifficultyColor(trail.difficult)}`}>{trail.difficult || 'N/A'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Duration:</span>
              <span className="font-semibold">{`${trail.duration?.min || '?'} - ${trail.duration?.max || '?'} hrs`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" /> Distance:</span>
              <span className="font-semibold">{trail.distance ? `${trail.distance} km` : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Mountain className="h-3 w-3" /> Elevation:</span>
              <span className="font-semibold">{trail.elevation ? `${trail.elevation} m` : 'N/A'}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}