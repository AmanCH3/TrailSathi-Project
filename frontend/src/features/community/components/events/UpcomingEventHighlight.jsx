import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { Button } from '../ui/Button';

export const UpcomingEventHighlight = ({ event, onViewDetails }) => {
  if (!event) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Event</h3>
        </div>
        <p className="text-gray-500 text-sm">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Event</h3>
      </div>

      <div className="mb-3">
        <h4 className="text-gray-900 font-medium mb-2 line-clamp-1">{event.title}</h4>
        
        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="line-clamp-1">{formatDateTime(event.date)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {onViewDetails && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewDetails(event.id || event._id)}
          className="w-full"
        >
          View Details
        </Button>
      )}
    </div>
  );
};
