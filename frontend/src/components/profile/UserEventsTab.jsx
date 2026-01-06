import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { EventCard } from '@/features/community/components/events/EventCard';
import { useNavigate } from 'react-router-dom';

export function UserEventsTab({ events = [] }) {
  const navigate = useNavigate();

  const handleViewEvent = (eventId) => {
    // Find the event to get the group ID
    const event = events.find(e => e._id === eventId);
    if (event && event.group) {
      navigate(`/community/groups/${event.group._id}/events/${eventId}`);
    } else {
        console.error("Event or Group ID not found for navigation");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-gray-700"/>
          <h2 className="text-2xl font-bold text-gray-800">My Events ({events.length})</h2>
      </div>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              onViewDetails={handleViewEvent}
              // onRSVP is not strictly needed here as they already joined, 
              // but EventCard might show "Joined" state if we pass data correctly.
              // For now, let's just show the card.
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16 border-2 border-dashed rounded-lg bg-white">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events joined</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't joined any events yet.</p>
        </div>
      )}
    </div>
  );
}
