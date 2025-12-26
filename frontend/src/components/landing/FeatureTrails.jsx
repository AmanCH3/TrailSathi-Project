// import { Mountain, MapPin, Clock, Sun, Cloud, CloudFog, Users2, Star, Zap, Users, Eye } from "lucide-react";
// import { useAdminTrail } from "../../hooks/admin/useAdminTrail"; 
// import { Link } from "react-router-dom";
// import { ViewTrailDialog } from "../admin/trail_management/ViewTrailDailog";
// import { useState } from "react";


// const FeaturedTrails = () => {
//   const [selectedTrail, setSelectedTrail] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const handleViewTrail = (trail) => {
//     setSelectedTrail(trail);
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setSelectedTrail(null);
//   };

//   const { trails, isLoading, isError, error } = useAdminTrail();
  
//   // --- FIX STARTS HERE ---
//   // This helper function is added to create the correct, full image URL.
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const SERVER_ROOT_URL = API_BASE_URL ? API_BASE_URL.replace('/api', '') : 'http://localhost:5050';

//   const getFullImageUrl = (path) => {
//     if (!path) {
//       // Your original placeholder logic can be used here if you prefer
//       return "https://via.placeholder.com/400x250?text=Trail+Image";
//     }
//     if (path.startsWith('http://') || path.startsWith('https://')) {
//       return path;
//     }
//     return `${SERVER_ROOT_URL}/${path.replace(/\\/g, '/')}`;
//   };
//   // --- FIX ENDS HERE ---

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy": return "bg-green-100 text-green-800";
//       case "Moderate": return "bg-yellow-100 text-yellow-800";
//       case "Hard": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getSeasonIcon = (season) => {
//     switch (season) {
//       case "Spring": return "🌸";
//       case "Summer": return "☀️";
//       case "Fall": case "Autumn": return "🍂";
//       case "Winter": return "❄️";
//       default: return "🌿";
//     }
//   };

//   if (isLoading) {
//     return (
//       <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Trails</h2>
//             <p className="text-gray-600">Loading amazing trails for you...</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (isError) {
//     return (
//       <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Trails</h2>
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
//             <p className="text-red-600">Failed to load trails: {error.message}</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-10 px-4 bg-gradient-to-br from-green-50 to-blue-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-12">
//           <div>
//             <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Trails</h2>
//             <p className="text-xl text-gray-600">Discover breathtaking hiking trails in Nepal</p>
//           </div>
//           <Link to="/all-trails" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm">
//             View All Trails
//             <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//             </svg>
//           </Link>
//         </div>

//         {/* Trail Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {trails.slice(0, 3).map((trail) => (
//             <div key={trail._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
//               {/* Image */}
//               <div className="relative overflow-hidden">
//                 <div className="relative h-64 w-full bg-gray-200">
//                   <img 
//                     // --- FIX APPLIED HERE ---
//                     src={getFullImageUrl(trail.images?.[0])} 
//                     alt={trail.name} 
//                     className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/400x250?text=Trail+Image";
//                     }}
//                   />
//                 </div>
                
//                 {/* Difficulty Badge */}
//                 <div className="absolute top-4 left-4">
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(trail.difficult)}`}>
//                     {trail.difficult}
//                   </span>
//                 </div>

//                 {/* Rating Badge */}
//                 {trail.averageRating && (
//                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
//                     <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                     <span className="text-sm font-semibold text-gray-900">
//                       {trail.averageRating.toFixed(1)}
//                     </span>
//                     <span className="text-xs text-gray-600">({trail.numRatings})</span>
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-6">
//                 {/* Title and Location */}
//                 <div className="mb-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Mountain className="h-5 w-5 text-green-600" />
//                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
//                       {trail.name}
//                     </h3>
//                   </div>
//                   <div className="flex items-center text-gray-600 mb-2">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     <span className="text-sm">{trail.location}</span>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 {trail.description && (
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                     {trail.description}
//                   </p>
//                 )}

//                 {/* Trail Info Grid */}
//                 <div className="grid grid-cols-2 gap-3 mb-4">
//                   <div className="flex items-center gap-2">
//                     <Mountain className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-xs text-gray-500">Elevation</p>
//                       <p className="text-sm font-semibold">{trail.elevation}m</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-xs text-gray-500">Duration</p>
//                       <p className="text-sm font-semibold">{trail.duration.min}-{trail.duration.max}h</p>
//                     </div>
//                   </div>
                  
//                   {trail.distance && (
//                     <div className="flex items-center gap-2">
//                       <Zap className="h-4 w-4 text-gray-500" />
//                       <div>
//                         <p className="text-xs text-gray-500">Distance</p>
//                         <p className="text-sm font-semibold">{trail.distance}km</p>
//                       </div>
//                     </div>
//                   )}
                  
//                   {trail.numRatings > 0 && (
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4 text-gray-500" />
//                       <div>
//                         <p className="text-xs text-gray-500">Reviews</p>
//                         <p className="text-sm font-semibold">{trail.numRatings}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-6 flex gap-2">
//                   {/* View Details Button - Opens Dialog */}
//                   <button 
//                     onClick={() => handleViewTrail(trail)}
//                     className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
//                   >
//                     <Eye className="h-4 w-4" />
//                     Quick View
//                   </button>
                  
//                   {/* Full Details Link - Goes to dedicated page */}
//                   <Link 
//                     to={`/trail/${trail._id}`}
//                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
//                   >
//                     Full Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* View Trail Dialog */}
//       <ViewTrailDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         trail={selectedTrail}
//       />
//     </section>
//   );
// };

// export default FeaturedTrails;






import { ArrowRight, Star, ChevronRight, CheckCircle, Clock, Bookmark } from "lucide-react";
import { useAdminTrail } from "../../hooks/admin/useAdminTrail";
import { useUserProfile } from "../../hooks/useUserProfile";
import { Link, useNavigate } from "react-router-dom";
import { ViewTrailDialog } from "../admin/trail_management/ViewTrailDailog";
import { useState } from "react";
import { useSavedTrails } from "../../context/SavedTrailsContext";

const FeaturedTrails = () => {
  const navigate = useNavigate();
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { saveTrail, unsaveTrail, isSaved } = useSavedTrails();

  // Fetch trails (limit 4 to match screenshot row)
  const { trails, isLoading, isError } = useAdminTrail({ limit: 4 });
  const { data: user } = useUserProfile();

  const isTrailJoined = (trailId) => {
    return user?.joinedTrails?.some(jt => (jt.trail._id || jt.trail) === trailId);
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

  const getFullImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop";
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${API_BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

 // Helper to format duration based on length (approx 3km/h)
  const getDuration = (length) => {
      const hours = length / 3;
      return `${Math.floor(hours)}-${Math.ceil(hours)} hr`;
  }

  if (isLoading) {
    return (
      <section className="py-12 px-6 max-w-[1400px] mx-auto">
         <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
                <div key={i} className="space-y-3">
                    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
            ))}
         </div>
      </section>
    );
  }

  if (isError || !trails || trails.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-[1440px] mx-auto font-sans relative">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Featured Trails</h2>
            <Link to="/trails" className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-4 h-4" />
            </Link>
        </div>

        {/* Grid / Carousel container */}
        <div className="relative group/container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trails.slice(0, 4).map((trail) => (
                    <div 
                        key={trail._id} 
                        className="group flex flex-col gap-3 cursor-pointer"
                        // Navigate to detail page
                        onClick={() => navigate(`/trails/${trail._id}`)}
                    >
                        {/* Image Card */}
                        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-gray-100">
                             <img 
                                src={getFullImageUrl(trail.images?.[0])} 
                                alt={trail.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                             />
                             
                             {/* Bookmark Icon - Right Side */}
                             <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent navigation
                                  if (isSaved(trail._id)) {
                                    unsaveTrail(trail._id);
                                  } else {
                                    saveTrail(trail);
                                  }
                                }}
                                className={`absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm z-20 ${
                                  isSaved(trail._id) 
                                    ? 'bg-gray-900 hover:bg-black' 
                                    : 'bg-white/90 hover:bg-white'
                                }`}
                                aria-label={isSaved(trail._id) ? "Remove from saved" : "Save trail"}
                             >
                                <Bookmark 
                                  className={`w-5 h-5 transition-all ${
                                    isSaved(trail._id) 
                                      ? 'fill-white text-white' 
                                      : 'text-gray-700'
                                  }`}
                                />
                             </button>
                             
                             {/* Planned Badge - Moved to left since bookmark is on right */}
                             {isTrailJoined(trail._id) && (
                                <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Planned
                                </div>
                             )}
                        </div>

                        {/* Content */}
                        <div className="space-y-1">
                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 leading-snug truncate">
                                {trail.name}
                            </h3>
                            
                            {/* Subtitle / Location */}
                            <p className="text-sm text-gray-500 font-medium truncate">
                                {trail.location || "Unknown Location"}
                            </p>
                            
                            {/* Meta Row: Rating · Difficulty · Length · Duration */}
                            {/* Matches: ★ 4.1 · Moderate · 14.8 mi · Est. 5-5.5 hr */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                                <div className="flex items-center gap-0.5 text-gray-900 font-bold">
                                    <Star className="w-3 h-3 fill-current" /> 
                                    <span>{trail.ratingsAverage?.toFixed(1) || "New"}</span>
                                </div>
                                <span>·</span>
                                <span className={trail.difficulty === 'Hard' ? 'text-red-600' : trail.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}>
                                    {trail.difficulty}
                                </span>
                                <span>·</span>
                                <span>{trail.length} km</span>
                                <span>·</span>
                                <span>Est. {getDuration(trail.length)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrow (Visual only for now, or link to list) */}
             <button className="absolute -right-5 top-1/2 -translate-y-1/2 translate-x-full w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors z-10 hidden xl:flex">
                <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
        </div>

        <ViewTrailDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            trail={selectedTrail}
        />
    </section>
  );
};

export default FeaturedTrails;