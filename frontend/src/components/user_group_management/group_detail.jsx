// "use client"

// import React, { useState } from "react";
// // REMOVED: useNavigate hook is no longer needed here.
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { CalendarDays, MapPin, Share2, Check, X } from "lucide-react";
// import { useApproveJoinRequest, useDenyJoinRequest, useRequestToJoinGroup } from "../../hooks/useGroup";
// import { JoinGroupDialog } from "./join_group_dailog";
// import { GroupChat } from "./group_chat";

// const getDifficultyBadgeColor = (difficulty) => {
//     switch (difficulty) {
//         case 'Easy': return 'bg-green-100 text-green-800 hover:bg-green-100';
//         case 'Moderate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
//         case 'Difficult': return 'bg-red-100 text-red-800 hover:bg-red-100';
//         default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
//     }
// }

// export function GroupDetails({ group, user, onClose }) {
//   const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);

//   if (!group) {
//     return null;
//   }

//   const requestJoinMutation = useRequestToJoinGroup();
//   const approveMutation = useApproveJoinRequest();
//   const denyMutation = useDenyJoinRequest();

//   const {
//     _id: groupId,
//     title,
//     description,
//     date,
//     maxSize,
//     leader,
//     participants = [],
//     trail,
//   } = group;

//   const displayTime = new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//   const displayLocation = trail?.location || 'Not specified';
//   const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
//   
//   const confirmedParticipants = participants.filter(p => p.status === 'confirmed');
//   const currentSize = confirmedParticipants.length;
//   const isGroupFull = currentSize >= maxSize;
//   
//   const isCurrentUserLeader = leader?._id === user?._id;
//   const currentUserParticipantEntry = participants.find(p => p.user?._id === user?._id);
//   const isCurrentUserConfirmedParticipant = currentUserParticipantEntry?.status === 'confirmed';
//   const hasPendingRequest = currentUserParticipantEntry?.status === 'pending';
//   
//   const pendingJoinRequests = participants.filter(p => p.status === 'pending');

//   const handleSendJoinRequest = ({ message }) => {
//     requestJoinMutation.mutate({ groupId, data: { message } });
//   };
//   const handleApprove = (requestId) => approveMutation.mutate({ groupId, requestId });
//   const handleDeny = (requestId) => denyMutation.mutate({ groupId, requestId });

//   const canViewChat = isCurrentUserLeader || isCurrentUserConfirmedParticipant;
  
//   // --- CORRECTED HANDLECLOSE FUNCTION ---
//   // It now ONLY calls the onClose prop. No more navigation logic.
//   const handleClose = () => {
//     if (onClose) {
//         onClose();
//     }
//   };

//   return (
//     <>
//       <JoinGroupDialog
//         open={isJoinDialogOpen}
//         setOpen={setJoinDialogOpen}
//         groupTitle={group.title}
//         onJoin={handleSendJoinRequest}
//       />
//     
//         <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
//             <h2 className="text-lg font-semibold">{title}</h2>
//             <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleClose}>
//                 <X className="h-5 w-5" />
//             </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 flex-grow overflow-hidden">
//             <div className="lg:col-span-2 p-6 space-y-6 overflow-y-auto">
//               <section>
//                 <div className="flex justify-between items-start mb-4">
//                     <div>
//                         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-500 mt-2">
//                             <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /><span>{displayDate} at {displayTime}</span></div>
//                             <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{displayLocation}</span></div>
//                         </div>
//                     </div>
//                     <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Share2 className="h-4 w-4 mr-2" />Share</Button>
//                 </div>
//                 <p className="text-gray-600 mb-6">{description}</p>
//                 {!isCurrentUserConfirmedParticipant && !isCurrentUserLeader && (
//                     <Button onClick={() => setJoinDialogOpen(true)} disabled={isGroupFull || hasPendingRequest || requestJoinMutation.isPending} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-lg">
//                     {hasPendingRequest ? "Request Pending" : isGroupFull ? "Group Full" : "Request to Join"}
//                     </Button>
//                 )}
//                 {isCurrentUserConfirmedParticipant && !isCurrentUserLeader && (
//                     <Badge className="w-full justify-center py-2 text-lg bg-blue-100 text-blue-800">You are a participant!</Badge>
//                 )}
//                 {isCurrentUserLeader && (
//                     <Badge className="w-full justify-center py-2 text-lg bg-indigo-100 text-indigo-800">You are the leader!</Badge>
//                 )}
//               </section>

//               {canViewChat && (
//                 <section>
//                   <h3 className="text-xl font-semibold mb-4">Group Chat</h3>
//                   <GroupChat groupId={groupId} currentUser={user} />
//                 </section>
//               )}
//             </div>

//             <div className="border-l bg-gray-50 p-6 space-y-6 overflow-y-auto">
//                 <section>
//                     <h3 className="text-lg font-semibold mb-4">Group Leader</h3>
//                     <div className="flex items-center gap-3">
//                         <Avatar>
//                             <AvatarImage src={leader?.profileImage} />
//                             <AvatarFallback>{leader?.name.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                             <p className="font-semibold">{leader?.name}</p>
//                             <p className="text-sm text-gray-500">{leader?.hikerType || 'Hiker'}</p>
//                         </div>
//                     </div>
//                 </section>

//                 <section>
//                     <h3 className="text-lg font-semibold mb-4">Participants ({currentSize}/{maxSize})</h3>
//                     <div className="space-y-3">
//                         {confirmedParticipants.map(p => (
//                             <div key={p._id} className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <Avatar className="h-9 w-9">
//                                         <AvatarImage src={p.user?.profileImage} />
//                                         <AvatarFallback>{p.user?.name.charAt(0)}</AvatarFallback>
//                                     </Avatar>
//                                     <div>
//                                         <p className="font-medium text-sm">{p.user?.name}</p>
//                                     </div>
//                                 </div>
//                                 <Badge variant="outline" className="text-green-600 border-green-200">Confirmed</Badge>
//                             </div>
//                         ))}
//                     </div>
//                 </section>

//                 {isCurrentUserLeader && pendingJoinRequests.length > 0 && (
//                     <section>
//                         <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
//                         <div className="space-y-3">
//                             {pendingJoinRequests.map(p => (
//                                 <Card key={p._id} className="p-3">
//                                     <div className="flex items-center justify-between">
//                                         <p className="font-medium text-sm">{p.user?.name}</p>
//                                         <div className="flex gap-2">
//                                             <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleApprove(p._id)}><Check className="h-4 w-4 text-green-600" /></Button>
//                                             <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleDeny(p._id)}><X className="h-4 w-4 text-red-600" /></Button>
//                                         </div>
//                                     </div>
//                                     {p.message && <p className="text-xs text-gray-500 mt-2 border-l-2 pl-2">"{p.message}"</p>}
//                                 </Card>
//                             ))}
//                         </div>
//                     </section>
//                 )}
//             </div>
//         </div>
//     </>
//   );
// }




// src/components/admin/group_management/group_detail.jsx
"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  MapPin,
  Clock,
  Mountain,
  Navigation, // Not used, consider removing
  Share2,
  Star,
  CloudSun, // Not used, consider removing
  Thermometer, // Not used, consider removing
  Droplets, // Not used, consider removing
  Route,
  Check,
  X,
} from "lucide-react";
import { 
    useRequestToJoinGroup, 
    useApproveJoinRequest, 
    useDenyJoinRequest,
    useDeleteOneGroup 
} from "../../hooks/useGroup";
import { toast } from "react-toastify";
import { JoinGroupDialog } from "./join_group_dailog";
import { GroupChat } from "./group_chat";




const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    if (typeof duration === 'object' && duration.min !== undefined && duration.max !== undefined) {
        if (duration.min === duration.max) return `${duration.max} hours`;
        return `${duration.min}-${duration.max} hours`;
    }
    return `${duration} hours`;
};

// Helper to get the correct color for the difficulty badge
const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
        case 'Easy': return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'Moderate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case 'Difficult': return 'bg-red-100 text-red-800 hover:bg-red-100'; // Corrected 'Hard' to 'Difficult'
        default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
}

export function GroupDetails({ group, user }) {


   const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);
  if (!group) {
    return <div className="text-center text-gray-500 mt-10">Group data is not available.</div>;
  }
  
  const requestJoinMutation = useRequestToJoinGroup(); 
  const approveMutation = useApproveJoinRequest(); 
  const denyMutation = useDenyJoinRequest();
  const deleteGroupMutation = useDeleteOneGroup(); 
  
  const {
    _id : groupId,
    title,
    description,
    date,
    maxSize,
    leader, 
    participants = [], 
    status, 
    meetingPoint, 
    requirements = [], 
    difficulty, 
    photos = [], 
    comments = [], 
    trail, 
  } = group;

  const displayTime = new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const displayLocation = trail?.location || meetingPoint?.description || 'Not specified';
  const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // Filter confirmed participants
  const confirmedParticipants = participants.filter(p => p.status === 'confirmed');
  const currentSize = confirmedParticipants.length;
  const isGroupFull = currentSize >= maxSize;
  
  // Identify current user's role and request status
  const isCurrentUserLeader = leader?._id === user?._id;
  const currentUserParticipantEntry = participants.find(p => p.user?._id === user?._id); 
  const isCurrentUserConfirmedParticipant = currentUserParticipantEntry?.status === 'confirmed';
  const hasPendingRequest = currentUserParticipantEntry?.status === 'pending';
  
  const pendingJoinRequests = participants.filter(p => p.status === 'pending'); 

    const handleSendJoinRequest = ({ message }) => {
    requestJoinMutation.mutate({ groupId, data: { message } });
  };
  const handleApprove = (requestId) => approveMutation.mutate({ groupId, requestId });
  const handleDeny = (requestId) => denyMutation.mutate({groupId, requestId });

  const handleDeleteGroup = async () => {
    if(confirm("Are you sure you want to delete this group? This cannot be undone.")) {
        deleteGroupMutation.mutate(groupId, {
            onSuccess: () => {
                 toast.success("Group deleted successfully");
                 // Close modal if prop provided, navigation handled by query invalidation usually
                 // but strictly speaking we might want to navigate explicitly if on a detail page
                 if (user) window.location.href = '/community/groups'; // Simple redirect fallback
            }
        });
    }
  };

   const canViewChat = isCurrentUserLeader || isCurrentUserConfirmedParticipant;

  return (
    <>
     <JoinGroupDialog
        open={isJoinDialogOpen}
        setOpen={setJoinDialogOpen}
        groupTitle={group.title}
        onJoin={handleSendJoinRequest} 
      />

     

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 max-h-[90vh] overflow-y-auto">
      <div className="lg:col-span-2 space-y-8">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /><span>{displayDate} at {displayTime}</span></div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{displayLocation}</span></div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Share2 className="h-4 w-4 mr-2" />Share</Button>
            </div>
            <p className="text-gray-600 mb-6">{description}</p>
              {!isCurrentUserConfirmedParticipant && !isCurrentUserLeader && (
                <Button onClick={() => setJoinDialogOpen(true)} disabled={isGroupFull || hasPendingRequest || requestJoinMutation.isPending} size="lg" className="w-full bg-green-600 hover:bg-green-700 text-lg">
                    {hasPendingRequest ? "Request Pending" : isGroupFull ? "Group Full" : "Request to Join"}
                </Button>
            )}
            {isCurrentUserConfirmedParticipant && !isCurrentUserLeader && (
                <Badge className="w-full justify-center py-2 text-lg bg-blue-100 text-red-500">You are a participant!</Badge>
            )}
            {isCurrentUserLeader && (
                <div className="space-y-3">
                    <Badge className="w-full justify-center py-2 text-lg bg-blue-50 text-purple-800">You are the leader!</Badge>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                         <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => toast.info("Edit Group Modal coming soon!")}>
                            Edit Group
                         </Button>
                         <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50" onClick={() => toast.info("Create Event Modal coming soon!")}>
                            Create Event
                         </Button>
                         <Button variant="destructive" className="w-full col-span-2" onClick={handleDeleteGroup} disabled={deleteGroupMutation.isPending}>
                            {deleteGroupMutation.isPending ? "Deleting..." : "Delete Group"}
                         </Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
         {canViewChat && (
            <Card>
              <CardHeader><CardTitle className="text-xl">Group Chat</CardTitle></CardHeader>
              <CardContent>
                <GroupChat groupId={groupId} currentUser={user} />
              </CardContent>
            </Card>
          )}

        <Card>
          <CardHeader><CardTitle className="text-xl">Trail Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h3 className="text-lg font-semibold text-gray-800">{trail?.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{trail?.description}</p> {/* Added trail description if available */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                      <div className="flex gap-3 items-center"><Route className="h-6 w-6 text-indigo-600"/><div className="text-sm"><div className="text-gray-500">Distance</div><div className="font-semibold text-gray-800">{trail?.distance} km</div></div></div>
                      <div className="flex gap-3 items-center"><Mountain className="h-6 w-6 text-indigo-600"/><div className="text-sm"><div className="text-gray-500">Elevation</div><div className="font-semibold text-gray-800">{trail?.elevation} m</div></div></div>
                      <div className="flex gap-3 items-center"><Clock className="h-6 w-6 text-indigo-600"/><div className="text-sm"><div className="text-gray-500">Duration</div><div className="font-semibold text-gray-800">{formatDuration(trail?.duration)}</div></div></div>
                      <div><div className="text-sm text-gray-500 mb-1">Difficulty</div><Badge className={getDifficultyBadgeColor(trail?.difficult)}>{trail?.difficult}</Badge></div> {/* Use trail?.difficult for trail difficulty */}
                  </div>
              </div>
          </CardContent>
        </Card>

        {photos && photos.length > 0 && (
            <Card>
                <CardHeader><CardTitle className="text-xl">Photos</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                          <img
                                key={index}
                                src={`http://localhost:5050/${photo}`} // Adjust path if needed
                                alt={`Group hike ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md shadow-sm"
                                />
                              ))}
                    </div>
                </CardContent>
            </Card>
        )}

        {comments && comments.length > 0 && (
          <Card>
                <CardHeader><CardTitle className="text-xl">Comments</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id || comment.id} className="border-b pb-3 last:border-b-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                {comment.user?.name || 'Anonymous'}
                                <span className="text-gray-500 text-xs font-normal">
                                    {new Date(comment.createAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-700 mt-1">{comment.text}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader><CardTitle className="text-xl">Group Leader</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={leader?.profileImage} alt={leader?.name} /> {/* Use profileImage from User model */}
                <AvatarFallback>{leader?.name?.substring(0, 2) || "L"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg text-gray-800">{leader?.name}</div>
                <div className="text-sm text-gray-500">{leader?.hikerType} Hiker</div>
                {/* Assuming leader also has rating and hikesLed stats from User model */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    {leader?.stats?.totalHikes !== undefined && (
                      <>
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-gray-700">{leader?.averageRating?.toFixed(1) || 'N/A'}</span> {/* Assuming averageRating exists on User model for leaders */}
                            <span className="text-gray-400">•</span>
                            <span>{leader?.stats?.hikesLed} hikes led</span> {/* Access from stats.hikesLed */}
                        </>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isCurrentUserLeader && pendingJoinRequests.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-xl">Join Requests ({pendingJoinRequests.length})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {pendingJoinRequests.map(req => (
                <div key={req._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={req.user?.profileImage} alt={req.user?.name} /> {/* Use profileImage from User model */}
                            <AvatarFallback>{req.user?.name?.substring(0, 2) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-sm text-gray-800">{req.user?.name}</div>
                            <p className="text-xs text-gray-500 line-clamp-1" title={req.message}>{req.message || 'No message.'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8 bg-green-100 hover:bg-green-200" onClick={() => handleApprove(req._id)} disabled={approveMutation.isPending}><Check className="h-4 w-4 text-green-700"/></Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 bg-red-100 hover:bg-red-200" onClick={() => handleDeny(req._id)} disabled={denyMutation.isPending}><X className="h-4 w-4 text-red-700"/></Button>
                    </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between text-xl"><span>Participants</span><Badge variant="secondary">{currentSize}/{maxSize}</Badge></CardTitle></CardHeader>
          <CardContent><div className="space-y-4">
            {confirmedParticipants.map((p) => (
              <div key={p._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={p.user?.profileImage} alt={p.user?.name} /> {/* Access profileImage from p.user */}
                    <AvatarFallback>{p.user?.name?.charAt(0) || "P"}</AvatarFallback>
                  </Avatar>
                  <div>
                      <div className="font-medium text-sm text-gray-800 flex items-center gap-2">
                        {p.user?.name}
                        {p.user?._id === leader?._id && <Badge className="bg-indigo-100 text-indigo-700 text-xs hover:bg-indigo-100">Leader</Badge>} {/* Check if this participant is also the leader */}
                      </div>
                      <div className="text-xs text-gray-500">{p.user?.hikerType}</div> {/* Access hikerType from p.user */}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
              </div>
            ))}
          </div></CardContent>
        </Card>
      </div>
    </div>
        </>
  );
}