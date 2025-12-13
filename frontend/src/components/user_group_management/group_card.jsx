// src/components/admin/group_management/group_card.jsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Clock, // Not used, consider removing
  Mountain, // Not used, consider removing
  TrendingUp, // Not used, consider removing
  Route, // Not used, consider removing
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDuration = (duration) => {
  if (!duration) return "N/A";
  if (typeof duration === "object" && duration.min !== undefined && duration.max !== undefined) {
    return duration.min === duration.max
      ? `${duration.max} hours`
      : `${duration.min}-${duration.max} hours`;
  }
  return `${duration} hours`;
};

export function GroupCard({ group, onView , onCreate }) {
  const navigate = useNavigate();
  // Ensure spotsFilled counts only confirmed participants if that's the intent
  // Otherwise, group.participants?.length counts all participants (pending, confirmed, declined)
  const spotsFilled = group.participants?.filter(p => p.status === 'confirmed').length || 0; 
  const spotsTotal = group.maxSize || 0;



  // This handler now prioritizes the onView function if it exists.
  const handleViewDetailsClick = (e) => {
    e.stopPropagation(); // Prevent the parent div's onClick from firing if any
    if (onView) {
      onView(group);
    } else {
      navigate(`/groups/${group._id}`);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:scale-105">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-bold">{group.title}</CardTitle>
          <Badge className="whitespace-nowrap">{spotsFilled}/{spotsTotal} Spots</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{group.trail?.name}</span> {/* Access trail name */}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>{new Date(group.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        {/* Leader */}
        <div>
          <p className="text-sm font-medium mb-2">Group Leader</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={group.leader?.profileImage} alt={group.leader?.name} /> {/* Use profileImage from User model */}
              <AvatarFallback>{group.leader?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{group.leader?.name || "Unknown"}</span>
          </div>
        </div>

        {/* Participants (only confirmed for visual count if preferred, or all for total) */}
        <div>
          <p className="text-sm font-medium mb-2">Participants</p>
          <div className="flex items-center">
            {group.participants?.filter(p => p.status === 'confirmed').slice(0, 4).map((p, i) => ( // Show only confirmed participants here for avatar stack
              <Avatar
                key={p._id || i}
                className="h-8 w-8 border-2 border-background -ml-2 first:ml-0"
              >
                <AvatarImage src={p.user?.profileImage} alt={p.user?.name} /> {/* Access profileImage from p.user */}
                <AvatarFallback>{p.user?.name?.charAt(0) || "P"}</AvatarFallback>
              </Avatar>
            ))}
            {group.participants?.filter(p => p.status === 'confirmed').length > 4 && (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-xs font-semibold border-2 border-background -ml-2">
                +{group.participants.filter(p => p.status === 'confirmed').length - 4}
              </div>
            )}
            <span className="text-sm text-muted-foreground ml-3">{spotsFilled} hikers</span>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <p className="text-sm font-medium mb-1">Description</p>
          <p className="text-sm text-muted-foreground line-clamp-3">{group.description}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleViewDetailsClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}