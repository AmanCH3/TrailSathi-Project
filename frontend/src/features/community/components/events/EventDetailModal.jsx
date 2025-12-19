import { useRef, useEffect } from 'react';
import { X, Calendar, MapPin, Users, CheckCircle, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { useEventDetail, useRSVPEvent, useConfirmAttendance } from '../../hooks/useEvents';
import { useCreateConversation } from '../../hooks/useMessages';
import { formatDateTime } from '../../utils/formatters';
import { getAssetUrl } from '@/utils/imagePath';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { ErrorBanner } from '../ui/ErrorBanner';
import { useNavigate } from 'react-router-dom';

export const EventDetailModal = ({ isOpen, onClose, eventId }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Hooks
  const { data: event, isLoading, error } = useEventDetail(eventId);
  const rsvpMutation = useRSVPEvent();
  const createConversationMutation = useCreateConversation();
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRSVP = () => {
    if (!event) return;
    rsvpMutation.mutate({
      eventId: event.id || event._id,
      hasRSVPd: event.hasRSVPd,
      groupId: event.group?.id || event.group?._id || event.group
    });
  };

  const handleMessageHost = async () => {
    if (!event?.host) return;
    try {
      const conversation = await createConversationMutation.mutateAsync({
        recipientId: event.host.id || event.host._id,
        initialMessage: `Hi! I'm interested in the event: ${event.title}`,
        relatedEventId: eventId
      });
      navigate(`/messenger/${conversation.id || conversation._id}`);
      onClose();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header / Loading State */}
        <div className="relative flex-1 overflow-y-auto p-0">
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-all"
            >
                <X className="w-5 h-5" />
            </button>

            {isLoading ? (
               <div className="p-6 space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-xl" />
               </div>
            ) : error ? (
               <div className="p-8">
                   <ErrorBanner message="Failed to load event details." onRetry={onClose} />
               </div>
            ) : event && (
               <>
                  {/* Banner */}
                  <div className="relative h-64 md:h-80 bg-gray-100">
                      {event.bannerImage ? (
                          <img 
                            src={getAssetUrl(event.bannerImage)} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                              <Calendar className="w-16 h-16 text-emerald-200" />
                          </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
                          <div className="flex items-start justify-between">
                              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2 drop-shadow-sm">
                                  {event.title}
                              </h1>
                              {event.difficulty && (
                                <Badge variant="member" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                                    {event.difficulty}
                                </Badge>
                              )}
                          </div>
                          <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                              <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  {formatDateTime(event.startDateTime || event.date)}
                              </div>
                              {(event.meetLocation || event.location) && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {event.meetLocation || event.location}
                                </div>
                              )}
                          </div>
                          {event.trailName && (
                              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/80 text-white text-xs font-medium backdrop-blur-md">
                                  <MapPin className="w-3 h-3" />
                                  Hike: {event.trailName}
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 space-y-8">
                      {/* Host */}
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                  {event.host?.avatar || event.host?.profileImage ? (
                                      <img src={getAssetUrl(event.host?.avatar || event.host?.profileImage)} alt={event.host.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold">
                                          {event.host?.name?.[0] || 'H'}
                                      </div>
                                  )}
                              </div>
                              <div>
                                  <p className="text-sm text-gray-500 font-medium">Hosted by</p>
                                  <p className="text-base font-bold text-gray-900">{event.host?.name || 'Unknown'}</p>
                              </div>
                          </div>
                          {/* Only show message button if user is not the host */}
                          {event.host && (event.host.id !== localStorage.getItem('userId') && event.host._id !== localStorage.getItem('userId')) && (
                              <Button variant="outline" size="sm" onClick={handleMessageHost} className="gap-2">
                                  <MessageCircle className="w-4 h-4" />
                                  Message
                              </Button>
                          )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                              <Users className="w-6 h-6 text-emerald-600 mb-2" />
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Attendees</span>
                              <span className="text-lg font-bold text-gray-900">
                                  {event.rsvpCount || 0}
                                  {event.maxParticipants ? ` / ${event.maxParticipants}` : ''}
                              </span>
                          </div>
                          {event.isConfirmed && (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
                                <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Status</span>
                                <span className="text-lg font-bold text-emerald-900">Confirmed</span>
                            </div>
                          )}
                          {/* Add more stats if needed */}
                      </div>

                      {/* Description */}
                      <div className="space-y-3">
                          <h3 className="text-lg font-bold text-gray-900">About this Event</h3>
                          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {event.description || 'No description provided.'}
                          </p>
                      </div>

                      {/* Checklist */}
                      {event.checklist && event.checklist.length > 0 && (
                          <div className="space-y-3">
                              <h3 className="text-lg font-bold text-gray-900">What to Bring</h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {event.checklist.map((item, idx) => (
                                      <li key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium">
                                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                      
                      {/* Safety */}
                       <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-amber-800">
                              <span className="font-bold">Safety First:</span> Always inform someone of your hiking plans.
                          </div>
                      </div>
                  </div>
                   </>
               )}
        </div>

        {/* Footer Actions */}
        {event && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
                <Button 
                    variant={event.hasRSVPd ? "secondary" : "primary"}
                    size="lg"
                    onClick={handleRSVP}
                    disabled={rsvpMutation.isPending}
                    className={`flex-1 shadow-lg ${!event.hasRSVPd ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                >
                    {rsvpMutation.isPending ? 'Updating...' : event.hasRSVPd ? 'Cancel RSVP' : 'Join Event'}
                </Button>
                {event.hasRSVPd && (
                   <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 px-4">
                       <CheckCircle className="w-4 h-4" />
                       You're going!
                   </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
