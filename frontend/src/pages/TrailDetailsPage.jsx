import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrail } from '../hooks/useTrail';
import { 
  Star, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Share2, 
  Download, 
  PlayCircle,
  Images,
  Upload,
  Heart,
  Search,
  SlidersHorizontal,
  MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CreateReviewModal } from '../components/reviews/CreateReviewModal';

export default function TrailDetailsPage() {
  const { id } = useParams();
  const { data: trail, isLoading, isError } = useTrail(id);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos', 'upload'

  // Helper to handle image URLs (relative vs absolute)
  const getFullImageUrl = (path) => {
      if (!path) return "/placeholder-trail.jpg";
      if (path.startsWith('http')) return path; // Already absolute (e.g., Unsplash)
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5050';
      // Ensure backend paths use / instead of \
      const cleanPath = path.replace(/\\/g, '/');
      return `${baseUrl}/${cleanPath}`;
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (isError || !trail) return <div className="flex h-screen items-center justify-center">Trail not found</div>;

  const getDuration = (length = 0) => {
    const hours = length / 3; // Approx 3km/h
    return `${hours.toFixed(1)} - ${(hours + 1).toFixed(1)} hr`;
  };

  return (
    <div className="bg-white min-h-screen font-sans pb-20">
      
      {/* Container */}
      <div className="max-w-[1240px] mx-auto px-6 pt-6">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            {trail.name}
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
             <div className="flex items-center gap-1">
                 <div className="flex text-yellow-500">
                     {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(trail.ratingsAverage || 0) ? "fill-current" : "text-gray-300"}`} />
                     ))}
                 </div>
                 <span className="text-gray-900 font-bold ml-1">{trail.ratingsAverage}</span>
                 <span className="text-gray-400">({trail.ratingsQuantity || 0} reviews)</span>
             </div>
             
             <span className="text-gray-300">|</span>
             
             <span className={`uppercase font-bold tracking-wide text-xs ${
               trail.difficulty === 'Hard' ? 'text-red-700' : trail.difficulty === 'Moderate' ? 'text-yellow-700' : 'text-green-700'
             }`}>
                {trail.difficulty}
             </span>

             <span className="text-gray-300">|</span>

             <span className="underline decoration-gray-300 underline-offset-4 hover:text-black cursor-pointer">
                {trail.location || "Shivapuri Nagarjun National Park"}
             </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[21/9] md:aspect-[2.5/1] bg-gray-100 rounded-[32px] overflow-hidden mb-8 shadow-sm relative">
             <img 
               src={getFullImageUrl(trail.images?.[0])} 
               alt={trail.name} 
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2 cursor-pointer hover:bg-white">
                 <Images className="w-4 h-4" /> View Photos
             </div>
        </div>

        {/* Action Bar & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Main Content */}
            <div className="lg:col-span-2 space-y-10">
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-semibold text-sm">
                        <PlayCircle className="w-5 h-5" /> Preview
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-semibold text-sm">
                        <Images className="w-5 h-5" /> All photos
                    </button>
                     <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors font-semibold text-sm shadow-md">
                        <Upload className="w-4 h-4" /> Upload
                    </button>
                     <button className="ml-auto w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                        <Download className="w-4 h-4" />
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 py-6 border-t border-b border-gray-100">
                    <div>
                        <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-1">
                            {trail.length} <span className="text-sm font-medium text-gray-500">km</span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-1">Length</div>
                    </div>
                    <div>
                         <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-1">
                            {trail.elevationGain} <span className="text-sm font-medium text-gray-500">m</span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-1">Elevation gain</div>
                    </div>
                     <div>
                         <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-1">
                            {getDuration(trail.length).split(' ')[0]} <span className="text-sm font-medium text-gray-500">hr</span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-1">Est. time</div>
                    </div>
                     <div>
                         <div className="text-lg font-bold text-gray-900 flex items-baseline gap-1 mt-1">
                            Point to point
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-1">Route type</div>
                    </div>
                </div>

                {/* Description */}
                <div>
                     <p className="text-gray-700 leading-relaxed text-[15px]">
                         {trail.description || "One of the best places to hike around Kathmandu Valley. Your hike begins from North side of Kathmandu valley, Sundarijal, and on the trail you will be able to witness source of fresh water, beautiful villages and their culture, variation on vegetation, and the majestic Himalayan range. There are places to buy water and food throughout the trip especially in the 1st half of the trek."}
                     </p>
                </div>


        {/* Reviews Section */}
        <div className="pt-12 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row gap-24 lg:gap-40">
            
            {/* Left: Ratings Summary */}
            <div className="lg:w-1/3 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                <div className="flex items-center gap-4">
                  <div className="text-6xl font-extrabold text-gray-900 tracking-tighter">
                    {trail.ratingsAverage?.toFixed(1) || "0.0"}
                    <span className="text-2xl text-gray-900 align-top ml-1">★</span>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-col">
                    <span className="underline decoration-gray-300 underline-offset-2">{trail.ratingsQuantity || 0} reviews</span>
                    <span className="underline decoration-gray-300 underline-offset-2">143 activities</span>
                  </div>
                </div>
              </div>

              {/* Star Bars */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = trail.reviews?.filter(r => Math.round(r.rating) === star).length || 0;
                  const total = trail.ratingsQuantity || 1;
                  const percent = (count / total) * 100;
                  
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-3 font-medium text-gray-600">{star}</span>
                      <Star className="w-3 h-3 text-gray-900 fill-current" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full" 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

               <CreateReviewModal trailId={trail._id}>
                   <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 font-semibold shadow-lg">
                      Review trail
                   </Button>
               </CreateReviewModal>
               
               <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
                   <button className="hover:text-black">Mark as completed</button>
                   <span>•</span>
                   <button className="hover:text-black">Suggest edit</button>
               </div>
            </div>

            {/* Right: Reviews List */}
            <div className="lg:w-1/2 space-y-10">
    
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search reviews" 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                      </Button>
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-10 ">
                  {trail.reviews && trail.reviews.length > 0 ? (
                    trail.reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-8 mb-8 last:border-0 relative ">
                        
                        {/* Header Row */}
                        <div className="flex  justify-between items-end mb-3 w-full ">
                            <div className="flex gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                                    {review.user?.profileImage ? (
                                        <img src={review.user.profileImage} alt={review.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        review.user?.name?.[0] || "U"
                                    )}
                                </div>
                                
                                {/* Name & Rating */}
                                <div>
                                    <h4 className="font-bold text-gray-900 text-[15px]">{review.user?.name || "TrailSathi User"}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                        <div className="flex text-gray-900 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />
                                            ))}
                                        </div>
                                        <span>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span>•</span>
                                        <span>Hiking</span>
                                    </div>
                                </div>
                            </div>

                            {/* Options Button */}
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 mb-3">
                            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 font-medium">
                                Great views
                            </span>
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-800 text-[15px] leading-relaxed mb-4 w-100">
                          {review.review}
                        </p>

                        {/* Images Grid */}
                        {review.images && review.images.length > 0 ? (
                          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            {review.images.map((img, idx) => (
                              <div key={idx} className="w-20 h-20 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                                  <img src={getFullImageUrl(img)} alt="Review" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                              </div>
                            ))}
                          </div>
                        ) : (
                           /* Show placeholders if no images (to match "Kelly Carr" screenshot vibe if desired, otherwise hide) */
                           null 
                        )}

                        {/* Footer Action */}
                        <button className="text-sm font-semibold underline decoration-gray-300 underline-offset-4 hover:text-gray-900 transition-colors">
                          Show activity
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
                        <Star className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                        <p>No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>
                
                 {trail.reviews?.length > 0 && (
                     <div className="text-center">
                         <Button variant="outline" className="rounded-full px-8 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold">
                             Show more
                         </Button>
                     </div>
                 )}

            </div>
          </div>
        </div>


            </div>


            {/* Right Column: Top Sights (Sidebar) - Using Trail Images as Sights */}
            <div className="hidden lg:block space-y-8">
                 <div className="sticky top-24">
                     <h3 className="font-bold text-lg mb-4">Photos & Sights</h3>
                     <div className="space-y-4">
                         {trail.images && trail.images.slice(0, 4).map((img, idx) => (
                             <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                                 <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                     <img src={getFullImageUrl(img)} alt={`Sight ${idx+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm truncate">View Point {idx + 1}</div>
                                      <div className="text-xs text-gray-500 truncate">Photo</div>
                                 </div>
                                 <ChevronRight className="w-4 h-4 text-gray-400" />
                             </div>
                         ))}
                         {(!trail.images || trail.images.length === 0) && (
                             <p className="text-sm text-gray-500">No photos available.</p>
                         )}
                     </div>
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
}
