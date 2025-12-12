// import React from 'react';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Mail, Phone, User, Shield, Calendar, Edit, UserPlus } from 'lucide-react';

// export function ProfileInfo({ user, onEdit }) {
//   const getInitials = (name) => {
//     if (!name) return 'U';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return `Member since ${new Date(dateString).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
//   };

//   return (
//     <Card className="h-full">
//       <CardContent className="p-6 text-center">
//         <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-green-200">
//           <AvatarImage src={user.profileImage} alt={user.name} />
//           <AvatarFallback className="text-3xl bg-gray-100">{getInitials(user.name)}</AvatarFallback>
//         </Avatar>
//         <h2 className="text-2xl font-bold">{user.name}</h2>
//         <p className="text-sm text-gray-500">{formatDate(user.joinDate)}</p>
//       </CardContent>
//       <div className="px-6 pb-6 space-y-4">
//         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Information</h3>
//         <div className="space-y-3">
//           <div className="flex items-center gap-3 text-sm">
//             <User className="h-4 w-4 text-gray-400"/>
//             <span>{user.name}</span>
//           </div>
//           <div className="flex items-center gap-3 text-sm">
//             <Mail className="h-4 w-4 text-gray-400"/>
//             <span>{user.email}</span>
//           </div>
//           <div className="flex items-center gap-3 text-sm">
//             <Phone className="h-4 w-4 text-gray-400"/>
//             <span>{user.phone || 'Not provided'}</span>
//           </div>
//           <div className="flex items-center gap-3 text-sm">
//             <Shield className="h-4 w-4 text-gray-400"/>
//             <span className="capitalize">{user.hikerType} Hiker</span>
//           </div>
//         </div>

//         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">About Me</h3>
//         <p className="text-sm text-gray-600">
//           {user.bio || 'No bio available.'}
//         </p>

//         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Emergency Contact</h3>
//         <div className="text-sm bg-red-50 p-3 rounded-lg border border-red-100">
//           <div className="flex items-center gap-3">
//             <UserPlus className="h-4 w-4 text-red-500"/>
//             <p><strong>Name:</strong> {user.emergencyContact?.name || 'Not set'}</p>
//           </div>
//           <div className="flex items-center gap-3 mt-2">
//             <Phone className="h-4 w-4 text-red-500"/>
//             <p><strong>Phone:</strong> {user.emergencyContact?.phone || 'Not set'}</p>
//           </div>
//         </div>
//       </div>
//       <CardFooter>
//         <Button onClick={onEdit} className="w-full">
//           <Edit className="mr-2 h-4 w-4" />
//           Edit Profile
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }





import React, { useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, User, Shield, Edit, UserPlus, Camera } from 'lucide-react';
import { useUpdateProfilePicture } from '../../hooks/useUserProfile';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export function ProfileInfo({ user, onEdit }) {
  const fileInputRef = useRef(null);
  const { mutate: updatePicture, isPending } = useUpdateProfilePicture();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return `Member since ${new Date(dateString).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
  };

  const handleAvatarClick = () => {
    if (!isPending) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      updatePicture(formData);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <Avatar className="h-24 w-24 ring-4 ring-green-200">
            <AvatarImage src={user.profileImage ? `${API_URL}${user.profileImage}` : ''} alt={user.name} />
            <AvatarFallback className="text-3xl bg-gray-100">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div
            className="absolute inset-0 flex items-center justify-center bg-black rounded-full cursor-pointer bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAvatarClick}
          >
            {isPending ? (
              <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
          disabled={isPending}
        />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-sm text-gray-500">{formatDate(user.joinDate)}</p>
      </CardContent>

      <div className="px-6 pb-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-gray-400"/>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-400"/>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-gray-400"/>
            <span>{user.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="h-4 w-4 text-gray-400"/>
            <span className="capitalize">{user.hikerType} Hiker</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">About Me</h3>
        <p className="text-sm text-gray-600">
          {user.bio || 'No bio available.'}
        </p>

        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Emergency Contact</h3>
        <div className="text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <div className="flex items-center gap-3">
            <UserPlus className="h-4 w-4 text-red-500"/>
            <p><strong>Name:</strong> {user.emergencyContact?.name || 'Not set'}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Phone className="h-4 w-4 text-red-500"/>
            <p><strong>Phone:</strong> {user.emergencyContact?.phone || 'Not set'}</p>
          </div>
        </div>
      </div>
      
      <CardFooter>
        <Button onClick={onEdit} className="w-full">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}