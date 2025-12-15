import React from 'react';
import { ArrowRight, Star, ChevronRight, User, Lock, Globe } from 'lucide-react';
import { useGroup } from '../../hooks/useGroup';
import { Link, useNavigate } from 'react-router-dom';
import { ENV } from "@config/env";

const GroupActivities = () => {
    const navigate = useNavigate();
  const { group: groups, isLoading, isError } = useGroup(); // Fetch groups
  const API_URL = ENV.API_URL;

  // Helper to get image URL
  const getImageUrl = (group) => {
      // Use coverImage from Group model
      if (group.coverImage) {
           const path = group.coverImage;
           if (path.startsWith('http')) return path;
           if (path === 'default_group_cover.jpg') return "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop"; 
           return `${API_URL}/${path.replace(/\\/g, '/')}`;
      }
      return "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop";
  };

  if (isLoading) {
    return (
      <section className="py-12 px-6 max-w-[1440px] mx-auto">
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
  
  if (!groups || groups.length === 0) {
      return null;
  }

  return (
    <section className="py-12 px-6 max-w-[1440px] mx-auto font-sans relative bg-gray-50">
      <div className="flex justify-between items-end mb-8">
          {/* Renaming title to sound more like a "Featured" section as requested implicitly by design matching */}
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Community Groups</h2>
          <Link to="/groups" className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
      </div>

       <div className="relative group/container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.slice(0, 4).map((group) => (
             <div 
                key={group._id} 
                className="group flex flex-col gap-3 cursor-pointer"
                onClick={() => navigate(`/groups/${group._id}`)}
              >
                 {/* Image Card */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-gray-100">
                    <img 
                      src={getImageUrl(group)} 
                      alt={group.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Privacy Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] uppercase font-bold px-2.5 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                        {group.privacy === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {group.privacy}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-gray-900 leading-snug truncate">
                        {group.name}
                   </h3>
                   <p className="text-sm text-gray-500 font-medium truncate">
                        {group.location || "Online Community"}
                   </p>

                   {/* Meta Row */}
                   <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                        <div className="flex items-center gap-0.5 text-gray-900 font-bold">
                            <User className="w-3 h-3" />
                            <span>{group.memberCount || 1} Members</span>
                        </div>
                        <span>·</span>
                        <span>{group.postCount || 0} Posts</span>
                        <span>·</span>
                        <span className="text-green-600">Active</span>
                   </div>
                </div>
            </div>
          ))}
        </div>
         {/* Navigation Arrow (matching FeaturedTrails) */}
         <button className="absolute -right-5 top-1/2 -translate-y-1/2 translate-x-full w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors z-10 hidden xl:flex">
            <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default GroupActivities;
