// import React, { useState } from 'react';
// import { useUserProfile } from '../hooks/useUserProfile';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { AlertCircle, User, TrendingUp, Users } from 'lucide-react';
// import Navbar from '../layouts/Header';
// import Footer from '../layouts/Footer';
// import { ProfileInfo } from '../components/profile/ProfileInfo';
// import { HikingStats } from '../components/profile/HikingStats';
// import { EditProfileDialog } from '../components/profile/EditProfileDialog';
// import { GroupDetails } from '../components/user_group_management/group_detail';
// import { UserGroupsTab } from '../components/profile/UseGroupTab';

// export default function ProfilePage() {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//   const { data: user, isLoading, isError, error } = useUserProfile();

//   const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
//     <button
//       onClick={() => onClick(id)}
//       className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
//         isActive 
//           ? 'bg-green-100 text-green-700 border-2 border-green-200 shadow-sm' 
//           : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
//       }`}
//     >
//       <Icon className="h-4 w-4" />
//       <span className="text-sm">{label}</span>
//     </button>
//   );

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'profile':
//         return (
//           <ProfileInfo 
//             user={user} 
//             onEdit={() => setEditDialogOpen(true)} 
//             showEditButton={true}
//           />
//         );
//       case 'stats':
//         return (
//           <HikingStats 
//             stats={user.stats} 
//             user={user}
//             recentHikes={user.recentHikes}
//             achievements={user.achievements}
//           />
//         );
//       case 'groups':
//         return (
//           <GroupDetails 
//             groups={user.groups}
//             groupActivity={user.groupActivity}
//             user={user}
//           />
//         );
//       default:
//         return (
//           <ProfileInfo 
//             user={user} 
//             onEdit={() => setEditDialogOpen(true)} 
//             showEditButton={true}
//           />
//         );
//     }
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="bg-gray-50/50">
//           <div className="container  py-10  md:py-10">
//             <div className="max-w-6xl mx-auto">
//               {/* Tab Navigation Skeleton */}
//               <div className="flex gap-10 mb-8 justify-center">
//                 <Skeleton className="h-12 w-24" />
//                 <Skeleton className="h-12 w-24" />
//                 <Skeleton className="h-12 w-24" />
//               </div>
              
//               {/* Content Skeleton */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <Skeleton className="h-[600px] w-full lg:col-span-1" />
//                 <Skeleton className="h-[600px] w-full lg:col-span-2" />
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (isError) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto py-24 px-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>
//               {error.message || "Failed to load user profile. Please try again later."}
//             </AlertDescription>
//           </Alert>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="bg-gray-50/50 min-h-screen">
//         <main className="container mx-10 py-10 md:py-20">
//           <div className="max-w-8xl mx-auto">
//             {/* Tab Navigation */}
//             <div className="flex gap-4 mb-8 justify-center">
//               <TabButton 
//                 id="profile" 
//                 label="Profile" 
//                 icon={User} 
//                 isActive={activeTab === 'profile'} 
//                 onClick={setActiveTab} 
//               />
//               <TabButton 
//                 id="stats" 
//                 label="Hiking Stats" 
//                 icon={TrendingUp} 
//                 isActive={activeTab === 'stats'} 
//                 onClick={setActiveTab} 
//               />
//               <TabButton 
//                 id="groups" 
//                 label="Groups" 
//                 icon={Users} 
//                 isActive={activeTab === 'groups'} 
//                 onClick={setActiveTab} 
//               />
//             </div>

//             {/* Tab Content */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {activeTab === 'profile' && (
//                 <>
//                   <div className="lg:col-span-1">
//                     <ProfileInfo 
//                       user={user} 
//                       onEdit={() => setEditDialogOpen(true)} 
//                       showEditButton={true}
//                     />
//                   </div>
//                   <div className="lg:col-span-2">
//                     {/* You can add a quick overview or recent activity here */}
//                     <div className="bg-white rounded-lg shadow-sm p-6 h-full">
//                       <h3 className="text-lg font-semibold mb-4">Profile Overview</h3>
//                       <div className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="bg-green-50 p-4 rounded-lg">
//                             <h4 className="font-medium text-green-900">Total Hikes</h4>
//                             <p className="text-2xl font-bold text-green-600">{user.stats?.totalHikes || 0}</p>
//                           </div>
//                           <div className="bg-blue-50 p-4 rounded-lg">
//                             <h4 className="font-medium text-blue-900">Distance Covered</h4>
//                             <p className="text-2xl font-bold text-blue-600">{user.stats?.totalDistance || 0} km</p>
//                           </div>
//                         </div>
//                         <div className="bg-gray-50 p-4 rounded-lg">
//                           <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
//                           <p className="text-sm text-gray-600">
//                             {user.recentHikes?.length > 0 
//                               ? `Last hike: ${user.recentHikes[0].name} on ${user.recentHikes[0].date}`
//                               : "No recent hiking activity"
//                             }
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
              
//               {activeTab === 'stats' && (
//                 <div className="lg:col-span-3">
//                   <HikingStats 
//                     stats={user.stats} 
//                     user={user}
//                     recentHikes={user.recentHikes}
//                     achievements={user.achievements}
//                   />
//                 </div>
//               )}
              
//               {activeTab === 'groups' && (
//                 <div className="lg:col-span-3">
//                   <UserGroupsTab
//                     groups={user.groups}
//                     user={user}
//                   />
//                 </div>
//               )}  
//             </div>
//           </div>
//         </main>
//       </div>
      
//       <EditProfileDialog
//         user={user}
//         isOpen={isEditDialogOpen}
//         onOpenChange={setEditDialogOpen}
//       />
//       <Footer />
//     </>
//   );
// }




import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, User, TrendingUp, Users, Mountain } from 'lucide-react'; // ✅ Icon for new tab is included
import Navbar from '../components/layout/Header';
import Footer from '../layouts/Footer';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { HikingStats } from '../components/profile/HikingStats';
import { EditProfileDialog } from '../components/profile/EditProfileDialog';
import { UserGroupsTab } from '../components/profile/UseGroupTab';
import { MyTrailsTab } from '../components/profile/MyTrailsTab'; // ✅ Import the new component for the trails tab

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const { data: user, isLoading, isError, error } = useUserProfile();

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg transition-colors font-medium text-sm md:text-base ${
        isActive 
          ? 'bg-green-100 text-green-700 border-2 border-green-200 shadow-sm' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50/50">
          <div className="container py-10 md:py-10">
            <div className="max-w-7xl mx-auto">
              {/* Tab Navigation Skeleton */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-12 w-28" />
              </div>
              
              {/* Content Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-[600px] w-full lg:col-span-1" />
                <Skeleton className="h-[600px] w-full lg:col-span-2" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-24 px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || "Failed to load user profile. Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50/50 min-h-screen">
        <main className="container mx-auto px-4 py-10 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-8 justify-center">
              <TabButton id="profile" label="Profile" icon={User} isActive={activeTab === 'profile'} onClick={setActiveTab} />
              <TabButton id="trails" label="My Trails" icon={Mountain} isActive={activeTab === 'trails'} onClick={setActiveTab} />
              <TabButton id="stats" label="Hiking Stats" icon={TrendingUp} isActive={activeTab === 'stats'} onClick={setActiveTab} />
              <TabButton id="groups" label="Groups" icon={Users} isActive={activeTab === 'groups'} onClick={setActiveTab} />
            </div>

            {/* Tab Content */}
            <div className="transition-opacity duration-300">
              {/* --- Profile Tab --- */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <ProfileInfo user={user} onEdit={() => setEditDialogOpen(true)} />
                  </div>
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                      <h3 className="text-lg font-semibold mb-4">Profile Overview</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900">Total Hikes Completed</h4>
                            <p className="text-3xl font-bold text-green-600">{user.stats?.totalHikes || 0}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900">Total Distance Covered</h4>
                            <p className="text-3xl font-bold text-blue-600">{user.stats?.totalDistance || 0} km</p>
                          </div>
                        </div>
                        {/* You can add more overview stats here if needed */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* --- My Trails Tab --- */}
              {activeTab === 'trails' && <MyTrailsTab user={user} />}

              {/* --- Hiking Stats Tab --- */}
              {activeTab === 'stats' && <HikingStats stats={user.stats} />}

              {/* --- Groups Tab --- */}
              {activeTab === 'groups' && <UserGroupsTab groups={user.groups} user={user} />}
            </div>
          </div>
        </main>
      </div>
      
      {/* Edit Profile Dialog (only mounted when user data is available) */}
      {user && (
        <EditProfileDialog
          user={user}
          isOpen={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
      <Footer />
    </>
  );
}