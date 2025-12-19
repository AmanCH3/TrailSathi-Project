import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { useEventDetail, useConfirmAttendance } from '../hooks/useEvents';
import { useCreateConversation } from '../hooks/useMessages';
import { formatDateTime } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBanner } from '../components/ui/ErrorBanner';

export const EventDetailPage = () => {
  const { groupId, eventId } = useParams();
  const navigate = useNavigate();
  
  const { data: event, isLoading, error } = useEventDetail(eventId);
  const confirmMutation = useConfirmAttendance();
  const createConversationMutation = useCreateConversation();

  const handleConfirmAttendance = () => {
    confirmMutation.mutate({
      eventId,
      isConfirmed: event.isConfirmed,
    });
  };

  const handleMessageHost = async () => {
    if (!event?.host) return;

    try {
      const conversation = await createConversationMutation.mutateAsync({
        recipientId: event.host.id || event.host._id,
        initialMessage: `Hi! I'm interested in the event: ${event.title}`,
      });
      navigate(`/messenger/${conversation.id || conversation._id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleBack = () => {
    if (groupId) {
      navigate(`/groups/${groupId}`);
    } else {
      navigate(-1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <ErrorBanner message="Failed to load event details." onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to group
        </button>

        {/* Event Banner */}
        {event.bannerImage && (
          <div className="h-64 rounded-2xl overflow-hidden mb-6 shadow-sm">
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex-1 leading-tight">{event.title}</h1>
              {event.difficulty && (
                <Badge variant="member" className="ml-4 flex-shrink-0">
                  {event.difficulty}
                </Badge>
              )}
            </div>

            {/* Host Info */}
            {event.host && (
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  {event.host.avatar && event.host.avatar !== '/default-avatar.jpg' ? (
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-xl">
                      {event.host.name?.charAt(0)?.toUpperCase() || 'H'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">Hosted by</p>
                  <p className="text-gray-900 font-semibold">{event.host.name}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleMessageHost} className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <MessageCircle className="w-4 h-4" />
                  Message Host
                </Button>
              </div>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Date & Time</p>
                  <p className="text-gray-900 font-medium">{formatDateTime(event.date)}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Meet Location</p>
                    <p className="text-gray-900 font-medium">{event.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Attendees</p>
                  <p className="text-gray-900 font-medium">{event.rsvpCount || 0} RSVPs</p>
                </div>
              </div>

              {event.isConfirmed && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Status</p>
                    <p className="text-emerald-700 font-medium">Confirmed Attendance</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Checklist */}
          {event.checklist && event.checklist.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">What to Bring</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.checklist.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 p-2 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirmed Attendees ({event.attendees.length})
              </h2>
              <div className="flex flex-wrap gap-4">
                {event.attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 pl-1 pr-3 py-1 rounded-full border border-gray-100">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200">
                      {attendee.avatar && attendee.avatar !== '/default-avatar.jpg' ? (
                        <img
                          src={attendee.avatar}
                          alt={attendee.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold">
                          {attendee.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{attendee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-bold mb-1">Safety First</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                Always inform someone of your hiking plans and expected return time. Check weather conditions before departure.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button
              variant={event.isConfirmed ? 'secondary' : 'primary'}
              onClick={handleConfirmAttendance}
              disabled={confirmMutation.isPending}
              className={`flex-1 md:flex-initial shadow-sm ${event.isConfirmed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {event.isConfirmed ? 'Cancel Attendance' : 'Confirm Attendance'}
            </Button>
            
            {event.hasRSVPd && !event.isConfirmed && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>You've RSVPd • Please confirm arrival</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
