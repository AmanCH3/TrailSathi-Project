"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Users, Mountain, TrendingUp, DollarSign, UserPlus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatDistanceToNow } from 'date-fns'
import { HikingLoader } from "../../common/HikingLoader"

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api"

// Fetch user activities
const getUserActivities = async (userId) => {
  const token = localStorage.getItem('token')
  const { data } = await axios.get(`${API_URL}/activity/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

// Helper function to get activity icon
const getActivityIcon = (type) => {
  const iconProps = {
    className: "h-4 w-4 text-muted-foreground",
    "aria-hidden": "true"
  }

  switch (type) {
    case 'user_joined':
      return <UserPlus {...iconProps} />
    case 'group_created':
      return <Users {...iconProps} />
    case 'hike_planned':
    case 'event_created':
      return <Calendar {...iconProps} />
    case 'hike_completed':
      return <Mountain {...iconProps} />
    case 'review_posted':
    case 'post_created':
      return <TrendingUp {...iconProps} />
    case 'payment_made':
      return <DollarSign {...iconProps} />
    default:
      return null
  }
}

export function UserActivityDialog({ open, onOpenChange, userId, userName }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-activity', userId],
    queryFn: () => getUserActivities(userId),
    enabled: open && !!userId,
  })

  const activities = data?.data || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Activity Log - {userName}
          </DialogTitle>
          <DialogDescription>
            All activities performed by this user
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <HikingLoader text="Loading activities" />
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load activities
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activities found for this user</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                    <AvatarFallback>
                      {activity.user.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <p className="text-sm">
                          <span className="font-semibold text-primary">{activity.user}</span>
                          {' '}
                          {activity.type === 'user_joined' && 'joined the community'}
                          {activity.type === 'group_created' && `created group "${activity.trail}"`}
                          {activity.type === 'hike_planned' && `planned a hike to ${activity.trail}`}
                          {activity.type === 'hike_completed' && `completed a hike to ${activity.trail}`}
                          {activity.type === 'review_posted' && `posted a review for ${activity.trail}`}
                          {activity.type === 'post_created' && (activity.trail ? `created a post in ${activity.trail}` : 'created a post')}
                          {activity.type === 'event_created' && `created an event`}
                          {activity.type === 'payment_made' && `made a payment of ${activity.trail}`}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </p>
                    {activity.trail && activity.type === 'group_created' && (
                      <div className="border rounded-md p-2 bg-gray-50/50 mt-2">
                        <p className="text-sm font-medium text-gray-800">{activity.trail}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !isError && activities.length > 0 && (
          <div className="border-t pt-3 text-center text-sm text-muted-foreground">
            Showing {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
