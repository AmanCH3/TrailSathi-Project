import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, CheckCircle, Flag, Mountain, XCircle } from 'lucide-react';
import { useCompleteTrail, useCancelJoinedTrail } from '../../hooks/admin/useAdminTrail';
import { ConfirmationDialog } from '../ui/confirmation-dialog.jsx';
import { ViewTrailDialog } from '../../components/admin/trail_management/ViewTrailDailog.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export function MyTrailsTab({ user }) {
  const { mutate: completeTrail, isPending: isCompleting } = useCompleteTrail();
  const { mutate: cancelTrail, isPending: isCancelling } = useCancelJoinedTrail();

  const [selectedTrail, setSelectedTrail] = useState(null);
  const [trailToCancel, setTrailToCancel] = useState(null);

  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder.svg";
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';
    const serverRootUrl = apiBaseUrl.replace('/api', '');
    return `${serverRootUrl}/${path.replace(/\\/g, '/')}`;
  };

  const handleComplete = (e, joinedTrailId) => {
    e.stopPropagation();
    completeTrail(joinedTrailId);
  };

  const handleConfirmCancel = () => {
    if (trailToCancel) {
      cancelTrail(trailToCancel._id);
      setTrailToCancel(null);
    }
  };

  const upcomingHikes = user.joinedTrails || [];
  const completedHikes = user.completedTrails || [];

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>My Upcoming Hikes ({upcomingHikes.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingHikes.length > 0 ? (
              upcomingHikes.map(hike => (
                <div 
                  key={hike._id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-gray-50/80 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setSelectedTrail(hike.trail)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img src={getFullImageUrl(hike.trail.images?.[0])} alt={hike.trail.name} className="w-20 h-20 rounded-md object-cover hidden sm:block"/>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{hike.trail.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1.5" /> {hike.trail.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1.5" /> Scheduled for: <strong>{new Date(hike.scheduledDate).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                    <Button onClick={(e) => handleComplete(e, hike._id)} disabled={isCompleting || isCancelling} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4"/>
                      {isCompleting ? "Completing..." : "Mark as Complete"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setTrailToCancel(hike); }} disabled={isCompleting || isCancelling}>
                       <XCircle className="mr-2 h-4 w-4"/>
                       Cancel
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <Mountain className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">No Upcoming Hikes</h3>
                <p className="mt-1 text-sm">You haven't scheduled any hikes yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Completed Hikes ({completedHikes.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedHikes.length > 0 ? (
             completedHikes.map(hike => (
                <div 
                  key={hike._id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50 hover:bg-green-50/80 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setSelectedTrail(hike.trail)}
                >
                  <div className="flex items-center gap-4">
                    <img src={getFullImageUrl(hike.trail.images?.[0])} alt={hike.trail.name} className="w-16 h-16 rounded-md object-cover hidden sm:block"/>
                    <div>
                      <h3 className="font-semibold text-gray-700">{hike.trail.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1.5" /> Completed on {new Date(hike.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-white font-medium">
                    <Flag className="mr-2 h-4 w-4"/>
                    Completed
                  </Badge>
                </div>
              ))
            ) : (
             <div className="text-center text-gray-500 py-10">
                <Flag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">No Completed Hikes</h3>
                <p className="mt-1 text-sm">Your completed hikes will appear here.</p>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ViewTrailDialog
        open={!!selectedTrail}
        onOpenChange={() => setSelectedTrail(null)}
        trail={selectedTrail}
      />
      <ConfirmationDialog
        isOpen={!!trailToCancel}
        onOpenChange={() => setTrailToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel This Hike?"
        description={`Are you sure you want to cancel your hike for "${trailToCancel?.trail.name}"? This action cannot be undone.`}
        confirmText="Yes, Cancel Hike"
        isDestructive={true}
      />
    </>
  );
}