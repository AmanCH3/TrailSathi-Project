// src/components/admin/trail_management/ViewTrailDailog.jsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Mountain, Zap, Star, X } from "lucide-react";

// Utils
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return "bg-gray-100 text-gray-800 border-gray-200";
  switch (difficulty.toLowerCase()) {
    case "easy": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "moderate": return "bg-amber-50 text-amber-700 border-amber-200";
    case "difficult": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export function ViewTrailDialog({ open, onOpenChange, trail, customAction }) {
  if (!trail) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const SERVER_ROOT_URL = API_BASE_URL ? API_BASE_URL.replace('/api', '') : 'http://localhost:5050';

  const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"; // Premium fallback
    if (path.startsWith('http')) return path;
    return `${SERVER_ROOT_URL}/${path.replace(/\\/g, '/')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-none shadow-2xl bg-white sm:rounded-2xl">
        
        {/* --- Hero Image Section --- */}
        <div className="relative h-64 w-full">
           <img 
             src={trail.images && trail.images.length > 0 ? getFullImageUrl(trail.images[0]) : getFullImageUrl(null)} 
             alt={trail.name} 
             className="h-full w-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
           
           <DialogClose className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md border border-white/10">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
           </DialogClose>

           <div className="absolute bottom-0 left-0 p-6 w-full">
              <Badge className={`mb-3 border-0 ${getDifficultyColor(trail.difficulty).replace('bg-', 'bg-white/90 ').replace('text-', 'text-black ')} backdrop-blur-sm`}>
                 {trail.difficulty || 'Moderate'}
              </Badge>
              <DialogTitle className="text-3xl font-bold text-white tracking-tight leading-tight mb-1 font-display">
                {trail.name}
              </DialogTitle>
              <div className="flex items-center text-white/90 text-sm font-medium">
                <MapPin className="h-4 w-4 mr-1.5 text-white/70" />
                {trail.location || 'Unknown Location'}
              </div>
           </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-3 border-b border-gray-100 divide-x divide-gray-100 bg-gray-50/50">
            <div className="p-4 text-center group hover:bg-white transition-colors">
                <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1 group-hover:text-amber-500 transition-colors">
                    <Star className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Distance</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{trail.length ? `${trail.length} km` : '-'}</p>
            </div>
            <div className="p-4 text-center group hover:bg-white transition-colors">
                <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1 group-hover:text-emerald-500 transition-colors">
                    <Mountain className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Elevation</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{trail.elevationGain ? `${trail.elevationGain} m` : '-'}</p>
            </div>
            <div className="p-4 text-center group hover:bg-white transition-colors">
                 <div className="flex items-center justify-center gap-1.5 text-gray-400 mb-1 group-hover:text-blue-500 transition-colors">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{trail.duration ? `${trail.duration} hrs` : '-'}</p>
            </div>
        </div>

        {/* --- Content Body --- */}
        <div className="p-6 space-y-6">
            
            {/* Description */}
            <div className="space-y-3">
               <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">About this trail</h4>
               <p className="text-gray-600 leading-relaxed text-[15px]">
                  {trail.description || 'No detailed description available for this trail yet. Start exploring to find out more!'}
               </p>
            </div>

            {/* Features & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {trail.features && trail.features.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                           {trail.features.map(feature => (
                               <span key={feature} className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-md border border-violet-100">
                                  {feature}
                               </span>
                           ))}
                        </div>
                    </div>
                 )}

                 {trail.seasons && trail.seasons.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Best Seasons</h4>
                         <div className="flex flex-wrap gap-2">
                           {trail.seasons.map(season => (
                               <span key={season} className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-100">
                                  {season}
                               </span>
                           ))}
                        </div>
                    </div>
                 )}
            </div>
        </div>

        {/* --- Footer --- */}
        <div className="p-6 pt-0">
             {customAction ? (
                <Button 
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-green-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all rounded-xl" 
                    onClick={customAction.onClick}
                >
                    {customAction.label}
                </Button>
            ) : (
                <Button className="w-full h-12 text-base font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800" onClick={() => alert('Default Join Action')}>
                    Join This Trail
                </Button>
            )}
        </div>

      </DialogContent>
    </Dialog>
  );
}