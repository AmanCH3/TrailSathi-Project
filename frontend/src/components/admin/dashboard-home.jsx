
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
// === Icon Imports Added ===
import { Users, Mountain, DollarSign, TrendingUp, Calendar, Clock, Loader2, X, Check, UserPlus } from "lucide-react"
import { useGetAllPendingRequests, useApproveJoinRequest, useDenyJoinRequest } from "../../hooks/useGroup"
import { useAnalytics } from "../../hooks/useAnalytics"
import { useRecentActivity } from "../../hooks/useActivity"
import { formatDistanceToNow } from 'date-fns'

// Helper function to format percentage change
const formatPercentage = (change) => {
  if (change === null || change === undefined || !isFinite(change)) {
    return "+0.0%"; // Default value if change is not available
  }
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
};

// === START: New Helper function for Icons ===
const getActivityIcon = (type) => {
    const iconProps = {
        className: "inline-block h-4 w-4 ml-1.5 mr-1 text-muted-foreground",
        "aria-hidden": "true"
    };

    switch (type) {
        case 'user_joined':
            return <UserPlus {...iconProps} />;
        case 'group_created':
            return <Users {...iconProps} />;
        case 'hike_planned':
            return <Calendar {...iconProps} />;
        case 'hike_completed':
            return <Mountain {...iconProps} />;
        case 'review_posted':
            return <TrendingUp {...iconProps} />;
        case 'post_created':
            return <Users {...iconProps} />;
        case 'event_created':
            return <Calendar {...iconProps} />;
        case 'payment_made':
            return <DollarSign {...iconProps} />;
        default:
            return null;
    }
}
// === END: New Helper function for Icons ===

export function DashboardHome() {
  const { data: pendingRequestsData, isLoading: isLoadingRequests } = useGetAllPendingRequests();
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useAnalytics();
  const { data: recentActivityData, isLoading: isLoadingActivity } = useRecentActivity();
  const approveMutation = useApproveJoinRequest();
  const denyMutation = useDenyJoinRequest();

  const pendingJoinRequests = pendingRequestsData?.data || [];
  const recentActivities = recentActivityData || [];
  const summary = analyticsData?.summary;

  const handleApproveRequest = (requestId, groupId) => {
    approveMutation.mutate({ requestId, groupId });
  };

  const handleDenyRequest = (requestId, groupId) => {
    denyMutation.mutate({ requestId, groupId });
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'text-gray-600 bg-gray-50';
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const userGrowthData = analyticsData?.userGrowth.map(item => ({
    month: monthNames[item._id - 1],
    users: item.users
  })) || [];

  const hikeData = analyticsData?.hikeData.map(item => ({
    month: monthNames[item._id - 1],
    completed: item.completed,
    cancelled: item.cancelled,
  })) || [];
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{summary?.totalUsers?.total || 0}</div>}
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-semibold">{formatPercentage(summary?.totalUsers?.percentageChange)}</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Hikes</CardTitle>
            <Mountain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{summary?.completedHikes?.total || 0}</div>}
            <p className="text-xs text-muted-foreground">
              {summary?.completedHikes?.scheduledThisMonth || 0} scheduled this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">${(summary?.totalRevenue?.total || 0).toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 font-semibold">{formatPercentage(summary?.totalRevenue?.percentageChange)}</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
                <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
                <ChartContainer config={{ users: { label: "Users", color: "hsl(var(--chart-1))" } }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                      <Area type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5" />
              Hike Status
            </CardTitle>
            <CardDescription>Completed vs Cancelled group hikes per month</CardDescription>
          </CardHeader>
          <CardContent>
          {isLoadingAnalytics ? (
                <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
            <ChartContainer config={{ completed: { label: "Completed", color: "hsl(var(--chart-3))" }, cancelled: { label: "Cancelled", color: "hsl(var(--chart-4))" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hikeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar dataKey="completed" stackId="a" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="cancelled" stackId="a" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Join Requests */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* === START: RECENT ACTIVITY CARD WITH ICONS === */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                </CardTitle>
                <CardDescription>All user logs and system activities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {isLoadingActivity ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : recentActivities.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No recent activity
                        </p>
                    ) : (
                        recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                                    <AvatarFallback>
                                        {activity.user.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {/* === ICON PLACEMENT MODIFIED HERE === */}
                                            <p className="text-sm">
                                                <span className="font-semibold text-primary">{activity.user}</span>
                                                {getActivityIcon(activity.type)}
                                                {activity.type === 'user_joined' && 'joined the community.'}
                                                {activity.type === 'group_created' && 'created a new group.'}
                                                {activity.type === 'hike_planned' && `planned a hike to ${activity.trail}.`}
                                                {activity.type === 'hike_completed' && `completed a hike to ${activity.trail}.`}
                                                {activity.type === 'review_posted' && `posted a review for ${activity.trail}.`}
                                                {activity.type === 'post_created' && (activity.trail ? `created a post in ${activity.trail}.` : 'created a post.')}
                                                {activity.type === 'event_created' && `created an event.`}
                                                {activity.type === 'payment_made' && `made a payment of ${activity.trail}.`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    {activity.trail && (activity.type === 'group_created') && (
                                        <div className="border rounded-md p-2 bg-gray-50/50">
                                            <p className="text-sm font-medium text-gray-800">{activity.trail}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
        {/* === END: RECENT ACTIVITY CARD WITH ICONS === */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Join Requests
            </CardTitle>
            <CardDescription>Group join requests awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {isLoadingRequests ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pendingJoinRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending requests
                </p>
              ) : (
                pendingJoinRequests.map((request) => (
                  <div key={request._id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{request.group?.title}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{request.group?.trail?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(request.group?.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full font-medium text-xs ${getDifficultyColor(request.group?.trail?.difficult)}`}>
                            {request.group?.trail?.difficult}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{request.user?.name}</span>
                          <span className="text-muted-foreground"> requested to join.</span>
                        </div>
                        {request.message && (
                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md border">"{request.message}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveRequest(request._id, request.group._id)}
                          disabled={approveMutation.isPending || denyMutation.isPending}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDenyRequest(request._id, request.group._id)}
                          disabled={approveMutation.isPending || denyMutation.isPending}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
// import { Users, Mountain, DollarSign, TrendingUp, Calendar, Clock, Loader2, X, Check, UserPlus, CheckCircle, XCircle } from "lucide-react"
// import { useGetAllPendingRequests, useApproveJoinRequest, useDenyJoinRequest } from "../../hooks/useGroup"
// import { useAnalytics } from "../../hooks/useAnalytics"
// import { useRecentActivity } from "../../hooks/useActivity"
// import { formatDistanceToNow } from 'date-fns'

// // Helper function to format percentage change
// const formatPercentage = (change) => {
//   if (change === null || change === undefined || !isFinite(change)) {
//     return "+0.0%"; // Default value if change is not available
//   }
//   const sign = change >= 0 ? "+" : "";
//   return `${sign}${change.toFixed(1)}%`;
// };

// // Helper function for Icons
// const getActivityIcon = (type) => {
//     const iconProps = {
//         className: "inline-block h-4 w-4 ml-1.5 mr-1 text-muted-foreground",
//         "aria-hidden": "true"
//     };

//     switch (type) {
//         case 'user_joined':
//             return <UserPlus {...iconProps} />;
//         case 'group_created':
//             return <Users {...iconProps} />;
//         case 'hike_joined':
//             return <UserPlus {...iconProps} />;
//         case 'hike_completed':
//             return <CheckCircle {...iconProps} />;
//         case 'hike_cancelled':
//             return <XCircle {...iconProps} />;
//         default:
//             return null;
//     }
// }

// export function DashboardHome() {
//   const { data: pendingRequestsData, isLoading: isLoadingRequests } = useGetAllPendingRequests();
//   const { data: analyticsData, isLoading: isLoadingAnalytics } = useAnalytics();
//   const { data: recentActivityData, isLoading: isLoadingActivity } = useRecentActivity();
//   const approveMutation = useApproveJoinRequest();
//   const denyMutation = useDenyJoinRequest();

//   // --- DEBUGGING LOGS ADDED ---
//   console.log("Data from useRecentActivity hook:", recentActivityData);
  
//   const pendingJoinRequests = pendingRequestsData?.data || [];
//   const recentActivities = recentActivityData?.data || [];
//   const summary = analyticsData?.summary;

//   console.log("Processed recentActivities variable:", recentActivities);
//   // -------------------------

//   const handleApproveRequest = (requestId, groupId) => {
//     approveMutation.mutate({ requestId, groupId });
//   };

//   const handleDenyRequest = (requestId, groupId) => {
//     denyMutation.mutate({ requestId, groupId });
//   };

//   const getDifficultyColor = (difficulty) => {
//     if (!difficulty) return 'text-gray-600 bg-gray-50';
//     switch (difficulty.toLowerCase()) {
//       case 'easy':
//         return 'text-green-600 bg-green-50';
//       case 'moderate':
//         return 'text-yellow-600 bg-yellow-50';
//       case 'hard':
//         return 'text-red-600 bg-red-50';
//       default:
//         return 'text-gray-600 bg-gray-50';
//     }
//   };

//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   const userGrowthData = analyticsData?.userGrowth.map(item => ({
//     month: monthNames[item._id - 1],
//     users: item.users
//   })) || [];

//   const hikeData = analyticsData?.hikeData.map(item => ({
//     month: monthNames[item._id - 1],
//     completed: item.completed,
//     cancelled: item.cancelled,
//   })) || [];
  
//   return (
//     <div className="space-y-6">
//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             {isLoadingAnalytics ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{summary?.totalUsers?.total || 0}</div>}
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600 font-semibold">{formatPercentage(summary?.totalUsers?.percentageChange)}</span> from last month
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Completed Hikes</CardTitle>
//             <Mountain className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             {isLoadingAnalytics ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{summary?.completedHikes?.total || 0}</div>}
//             <p className="text-xs text-muted-foreground">
//               {summary?.completedHikes?.scheduledThisMonth || 0} scheduled this month
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             {isLoadingAnalytics ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">${(summary?.totalRevenue?.total || 0).toFixed(2)}</div>}
//             <p className="text-xs text-muted-foreground">
//               <span className="text-green-600 font-semibold">{formatPercentage(summary?.totalRevenue?.percentageChange)}</span> from last month
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid gap-4 lg:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5" />
//               User Growth
//             </CardTitle>
//             <CardDescription>Monthly user registration trends</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoadingAnalytics ? (
//               <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
//             ) : (
//               <ChartContainer config={{ users: { label: "Users", color: "hsl(var(--chart-1))" } }} className="h-[300px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
//                     <Area type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Mountain className="h-5 w-5" />
//               Hike Status
//             </CardTitle>
//             <CardDescription>Completed vs Cancelled group hikes per month</CardDescription>
//           </CardHeader>
//           <CardContent>
//           {isLoadingAnalytics ? (
//               <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
//             ) : (
//             <ChartContainer config={{ completed: { label: "Completed", color: "hsl(var(--chart-3))" }, cancelled: { label: "Cancelled", color: "hsl(var(--chart-4))" } }} className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={hikeData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
//                   <Bar dataKey="completed" stackId="a" fill="hsl(var(--chart-3))" />
//                   <Bar dataKey="cancelled" stackId="a" fill="hsl(var(--chart-4))" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//               )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity and Join Requests */}
//       <div className="grid gap-4 md:grid-cols-2">
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Calendar className="h-5 w-5" />
//                     Recent Activity
//                 </CardTitle>
//                 <CardDescription>Latest user actions and system updates</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-4">
//                     {isLoadingActivity ? (
//                         <div className="flex justify-center items-center py-4">
//                             <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                         </div>
//                     ) : recentActivities.length === 0 ? (
//                         <p className="text-sm text-muted-foreground text-center py-4">
//                             No recent activity
//                         </p>
//                     ) : (
//                         recentActivities.map((activity) => (
//                             <div key={activity.id} className="flex items-start space-x-3">
//                                 <Avatar className="h-9 w-9 border">
//                                     <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
//                                     <AvatarFallback>
//                                         {activity.user.split(" ").map((n) => n[0]).join("")}
//                                     </AvatarFallback>
//                                 </Avatar>
//                                 <div className="flex-1 space-y-2">
//                                     <div className="flex items-center justify-between">
//                                         <div>
//                                             <p className="text-sm">
//                                                 <span className="font-semibold text-primary">{activity.user}</span>
//                                                 {getActivityIcon(activity.type)}
//                                                 {activity.type === 'user_joined' && 'joined the community.'}
//                                                 {activity.type === 'group_created' && 'created a new group.'}
//                                                 {activity.type === 'hike_joined' && `joined the hike: ${activity.trail}`}
//                                                 {activity.type === 'hike_completed' && `completed the hike: ${activity.trail}`}
//                                                 {activity.type === 'hike_cancelled' && `canceled the hike: ${activity.trail}`}
//                                             </p>
//                                             <p className="text-xs text-muted-foreground">
//                                                 {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="h-5 w-5" />
//               Pending Join Requests
//             </CardTitle>
//             <CardDescription>Group join requests awaiting approval</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4 max-h-[300px] overflow-y-auto">
//               {isLoadingRequests ? (
//                 <div className="flex justify-center items-center py-4">
//                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                 </div>
//               ) : pendingJoinRequests.length === 0 ? (
//                 <p className="text-sm text-muted-foreground text-center py-4">
//                   No pending requests
//                 </p>
//               ) : (
//                 pendingJoinRequests.map((request) => (
//                   <div key={request._id} className="border rounded-lg p-3 space-y-2">
//                     <div className="flex items-start justify-between">
//                       <div className="space-y-1 flex-1">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className="font-medium text-sm">{request.group?.title}</span>
//                           <span className="text-xs text-muted-foreground">•</span>
//                           <span className="text-xs text-muted-foreground">{request.group?.trail?.name}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <span>{new Date(request.group?.date).toLocaleDateString()}</span>
//                           <span>•</span>
//                           <span className={`px-2 py-1 rounded-full font-medium text-xs ${getDifficultyColor(request.group?.trail?.difficult)}`}>
//                             {request.group?.trail?.difficult}
//                           </span>
//                         </div>
//                         <div className="text-sm">
//                           <span className="font-medium">{request.user?.name}</span>
//                           <span className="text-muted-foreground"> requested to join.</span>
//                         </div>
//                         {request.message && (
//                           <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md border">"{request.message}"</p>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-1 ml-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleApproveRequest(request._id, request.group._id)}
//                           disabled={approveMutation.isPending || denyMutation.isPending}
//                           className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDenyRequest(request._id, request.group._id)}
//                           disabled={approveMutation.isPending || denyMutation.isPending}
//                           className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }