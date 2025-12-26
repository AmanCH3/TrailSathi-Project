// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { 
//   MoreVertical, 
//   Eye, 
//   Edit, 
//   Trash2, 
//   Mail, 
//   Calendar, 
//   CheckCircle, 
//   XCircle,
//   Clock,
//   Mountain,
//   Shield,
//   User,
//   Crown,
//   Activity
// } from 'lucide-react';

// // Enhanced InfoItem component with better styling
// const InfoItem = ({ icon: Icon, text, subtext, variant = "default" }) => (
//   <div className="flex items-center gap-2 text-sm">
//     <div className={`p-1.5 rounded-lg ${
//       variant === "success" ? "bg-green-50 text-green-600" :
//       variant === "danger" ? "bg-red-50 text-red-600" :
//       variant === "warning" ? "bg-yellow-50 text-yellow-600" :
//       "bg-gray-50 text-gray-600"
//     }`}>
//       <Icon className="h-3.5 w-3.5" />
//     </div>
//     <div className="flex-1 min-w-0">
//       <span className="text-gray-900 font-medium">{text}</span>
//       {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
//     </div>
//   </div>
// );

// // Status indicator component
// const StatusIndicator = ({ status }) => {
//   const statusConfig = {
//     Active: {
//       icon: CheckCircle,
//       className: "bg-green-50 text-green-700 border-green-200",
//       dotColor: "bg-green-500"
//     },
//     Inactive: {
//       icon: Clock,
//       className: "bg-gray-50 text-gray-700 border-gray-200",
//       dotColor: "bg-gray-400"
//     },
//     Suspended: {
//       icon: XCircle,
//       className: "bg-red-50 text-red-700 border-red-200",
//       dotColor: "bg-red-500"
//     }
//   };

//   const config = statusConfig[status] || statusConfig.Inactive;
//   const Icon = config.icon;

//   return (
//     <div className="flex items-center gap-2">
//       <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
//       <Badge variant="outline" className={`${config.className} font-medium`}>
//         <Icon className="mr-1 h-3 w-3" />
//         {status || 'Unknown'}
//       </Badge>
//     </div>
//   );
// };

// export function UserCard({ user, onView, onEdit, onDelete }) {
  
//   const roleConfig = {
//     Admin: {
//       icon: Crown,
//       className: "bg-purple-50 text-purple-700 border-purple-200",
//       cardBorder: "border-l-4 border-l-purple-500",
//       bgGradient: "bg-gradient-to-br from-purple-50/50 to-indigo-50/30"
//     },
//     Guide: {
//       icon: Mountain,
//       className: "bg-blue-50 text-blue-700 border-blue-200",
//       cardBorder: "border-l-4 border-l-blue-500",
//       bgGradient: "bg-gradient-to-br from-blue-50/50 to-cyan-50/30"
//     },
//     User: {
//       icon: User,
//       className: "bg-gray-50 text-gray-700 border-gray-200",
//       cardBorder: "border-l-4 border-l-gray-400",
//       bgGradient: "bg-gradient-to-br from-gray-50/50 to-slate-50/30"
//     }
//   };

//   const config = roleConfig[user.role] || roleConfig.User;
//   const RoleIcon = config.icon;

//   const formatDate = (dateString) => {
//     if (!dateString) return "Unknown";
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return "Invalid date";
//     }
//   };

//   // const getLastActive = () => {
//   //   if (!user.lastActive) return "Never";
//   //   const now = new Date();
//   //   const lastActive = new Date(user.lastActive);
//   //   const diffInHours = Math.floor((now - lastActive) / (1000 * 60 * 60));
    
//   //   if (diffInHours < 1) return "Just now";
//   //   if (diffInHours < 24) return `${diffInHours}h ago`;
//   //   if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
//   //   return formatDate(user.lastActive);
//   // };

//   return (
//     <Card className={`
//       group relative overflow-hidden transition-all duration-300 ease-out
//       hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
//       ${config.cardBorder}
//       border-0 shadow-sm bg-white
//     `}>
//       {/* Subtle background gradient */}
//       <div className={`absolute inset-0 ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
//       {/* Animated border glow effect */}
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
//       <CardHeader className="relative pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-4 flex-1 min-w-0">
//             <div className="relative">
//               <Avatar className="h-14 w-14 ring-2 ring-white shadow-md group-hover:ring-4 transition-all duration-300">
//                 <AvatarImage 
//                   src={user.avatar || '/placeholder.svg'} 
//                   alt={user.name}
//                   className="object-cover"
//                 />
//                 <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700">
//                   {(user.name || '')
//                     .split(' ')
//                     .map((n) => n[0])
//                     .join('')
//                     .toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               {/* Activity indicator */}
//               <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
//                 user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
//               }`}></div>
//             </div>
            
//             <div className="flex-1 min-w-0">
//               <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
//                 {user.name || 'Unknown User'}
//               </CardTitle>
//               <div className="flex flex-wrap items-center gap-2">
//                 <Badge variant="outline" className={`${config.className} font-medium`}>
//                   <RoleIcon className="mr-1 h-3 w-3" />
//                   {user.role || 'User'}
//                 </Badge>
//                 <StatusIndicator status={user.status} />
//               </div>
//             </div>
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button 
//                 variant="ghost" 
//                 size="sm"
//                 className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
//               >
//                 <span className="sr-only">Open menu</span>
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem onClick={onView} className="cursor-pointer">
//                 <Eye className="mr-2 h-4 w-4 text-blue-500" />
//                 <span>View Details</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
//                 <Edit className="mr-2 h-4 w-4 text-green-500" />
//                 <span>Edit User</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 onClick={onDelete} 
//                 className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 <span>Delete User</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </CardHeader>

//       <CardContent className="relative space-y-4 pt-0">
//         <div className="space-y-3">
//           <InfoItem 
//             icon={Mail} 
//             text={user.email || 'No email provided'} 
          
//           />
          
//           <InfoItem 
//             icon={Calendar} 
//             text={formatDate(user.createdAt || user.joinDate)}
//             subtext="Member since"
//             variant="default"
//           />
          
//           {/* <InfoItem 
//             icon={Activity} 
//             text={getLastActive()}
//             subtext="Last seen"
//             variant={user.status === 'Active' ? 'success' : 'default'}
//           /> */}
//         </div>
//       </CardContent>

//       {/* Stats Footer */}
//       {(user.hikesCompleted !== undefined || user.totalBookings !== undefined) && (
//         <CardFooter className="relative pt-4 border-t bg-gray-50/50">
//           <div className="flex items-center justify-between w-full text-sm">
//             {user.hikesCompleted !== undefined && (
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Mountain className="h-4 w-4" />
//                 <span className="font-medium">{user.hikesCompleted || 0}</span>
//                 <span>hikes completed</span>
//               </div>
//             )}
            
//             {user.totalBookings !== undefined && (
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Calendar className="h-4 w-4" />
//                 <span className="font-medium">{user.totalBookings || 0}</span>
//                 <span>total bookings</span>
//               </div>
//             )}
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// }




import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Mountain,
  User,
  Crown,
  Activity,
} from 'lucide-react';

// ✅ ADDED: API URL for constructing image paths
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// ... (Helper components like InfoItem and StatusIndicator remain the same) ...
const InfoItem = ({ icon: Icon, text, subtext, variant = "default" }) => (
    <div className="flex items-center gap-2 text-sm">
        <div className={`p-1.5 rounded-lg ${
            variant === "success" ? "bg-green-50 text-green-600" :
            variant === "danger" ? "bg-red-50 text-red-600" :
            variant === "warning" ? "bg-yellow-50 text-yellow-600" :
            "bg-gray-50 text-gray-600"
        }`}>
            <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
            <span className="text-gray-900 font-medium">{text}</span>
            {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
        </div>
    </div>
);

const StatusIndicator = ({ status }) => {
    // ... logic for status indicator ...
};


export function UserCard({ user, onView, onEdit, onDelete, onViewActivity }) {
  const roleConfig = {
    admin: { 
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: Crown 
    },
    guide: { 
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Mountain 
    },
    hiker: { 
      color: "bg-green-100 text-green-700 border-green-200",
      icon: User 
    }
  };

  const role = (user.role || 'hiker').toLowerCase();
  const config = roleConfig[role] || roleConfig.hiker;
  const RoleIcon = config.icon;

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-12 w-12 border-2 border-gray-100">
              <AvatarImage 
                src={user.profileImage ? `${API_URL}${user.profileImage}` : ''} 
                alt={user.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 font-semibold">
                {(user.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.name || 'Unknown User'}
              </h3>
              <Badge variant="outline" className={`${config.color} text-xs font-medium mt-1`}>
                <RoleIcon className="mr-1 h-3 w-3" />
                {user.role || 'Hiker'}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onView} className="cursor-pointer text-sm">
                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewActivity} className="cursor-pointer text-sm">
                <Activity className="mr-2 h-4 w-4 text-orange-500" />
                Activity Log
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer text-sm">
                <Edit className="mr-2 h-4 w-4 text-green-500" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete} 
                className="cursor-pointer text-sm text-red-600 focus:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email || 'No email'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs">
            Joined {formatDate(user.createdAt || user.joinDate)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}