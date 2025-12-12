import React from 'react';
import { ArrowRight, Calendar, User, MapPin } from 'lucide-react'; // Added MapPin
import { useGroup } from '../../hooks/useGroup';
import { Link } from 'react-router-dom';
import { ENV } from "@config/env";

const GroupActivities = () => {
  const { group: groups, isLoading, isError } = useGroup(1, 4); // Fetch 4 groups for the landing page
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
      <section className="py-16 px-6 bg-gray-50 text-center">
         <p>Loading activities...</p>
      </section>
    );
  }
  
  if (!groups || groups.length === 0) {
      return null;
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Recent Group Activities</h2>
          <Link to="/groups" className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.slice(0, 4).map((activity) => {
            // Check participants count (assuming backend sends participants array or memberCount)
            // Model says: memberCount and admins/owner. It implies participants might be stored in GroupMembership?
            // "getAllGroups" in controller strictly returns Group docs. Group doc has 'memberCount'.
            // It does NOT have 'participants' array populated usually in list view unless virtual?
            // Model has no virtual 'participants'.
            // So we use 'memberCount'.
            
            const spotsFilled = activity.memberCount || 1; 
            const spotsLeft = 10 - spotsFilled; // Hardcode max size if not in model? Model doesn't have maxSize.

            return (
            <div key={activity._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col">
              {/* Image Header */}
              <div className="h-40 w-full overflow-hidden relative">
                   <img 
                      src={getImageUrl(activity)} 
                      alt={activity.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                   />
                   <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-green-700">
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Open'}
                   </div>
              </div>

              {/* Activity Info */}
              <div className="p-5 flex-grow">
                 <h3 className="font-bold text-gray-900 mb-1 line-clamp-1" title={activity.name}>{activity.name}</h3>
                 
                 <div className="space-y-2 mb-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>
                            {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    {activity.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="truncate">{activity.location}</span>
                        </div>
                    )}
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-green-600" />
                        <div className="flex flex-col">
                           {/* Owner is likely just an ID in this view */}
                            <span className="font-medium truncate max-w-[150px]">{typeof activity.owner === 'object' ? activity.owner.name : "Group Admin"}</span>
                        </div>
                    </div>
                 </div>
              </div>
              
              {/* Join Button */}
              <div className="p-4 pt-0">
                  <Link to={`/groups/${activity._id}`}>
                    <button className="w-full bg-[#3A5A40] hover:bg-[#2f4a33] text-white py-2.5 rounded-lg font-medium text-sm transition-colors text-center">
                        View Group
                    </button>
                  </Link>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default GroupActivities;
