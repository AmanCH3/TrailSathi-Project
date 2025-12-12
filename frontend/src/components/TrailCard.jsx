"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

// This helper function now correctly reads the Vite environment variable
const getFullImageUrl = (path) => {
  if (!path) {
    // If no path is provided, return the path to a local placeholder image
    return "/placeholder.svg";
  }

  // Vite uses `import.meta.env` to access environment variables.
  // We get the base URL and remove the `/api` part to correctly point to the server root.
  const apiUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

  // Construct the full URL, replacing backslashes with forward slashes for URL compatibility.
  return `${apiUrl}/${path.replace(/\\/g, '/')}`;
};

export function TrailCard({ trail, onView, onEdit, onDelete }) {
  if (!trail) return null;

  // Use the helper function to get the image URL
  const imageUrl = getFullImageUrl(trail.images?.[0]);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={trail.name}
          className="absolute h-full w-full object-cover"
          // This onError handler will catch any loading errors and show the placeholder
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loops if the placeholder is also missing
            e.target.src = "/placeholder.svg";
          }}
        />
      </div>
      <CardHeader>
        <CardTitle>{trail.name}</CardTitle>
        <CardDescription>{trail.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {trail.description}
        </div>
        <div className="mt-auto flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(trail)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(trail)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(trail._id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}