import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mail,
  Calendar,
  User,
  Crown,
  Mountain,
  Shield
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export function ViewUserDialog({ open, onOpenChange, user }) {
  const getRoleIcon = (role) => {
    const roleMap = {
      admin: Crown,
      guide: Mountain,
      hiker: User,
    };
    return roleMap[role?.toLowerCase()] || User;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      guide: "bg-blue-100 text-blue-700 border-blue-200",
      hiker: "bg-green-100 text-green-700 border-green-200",
    };
    return colorMap[role?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const RoleIcon = getRoleIcon(user?.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex flex-col items-center text-center pb-4 border-b">
              <Avatar className="h-20 w-20 mb-3 border-2 border-gray-200">
                <AvatarImage
                  src={user.profileImage ? `${API_URL}${user.profileImage}` : ''}
                  alt={user.name}
                />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700">
                  {(user.name || "").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {user.name || "Unknown User"}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email || "No email"}</span>
              </div>

              <div className="flex gap-2">
                <Badge variant="outline" className={`${getRoleColor(user.role)} font-medium`}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {user.role || "Hiker"}
                </Badge>
                {user.subscription && user.subscription !== 'Basic' && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium">
                    <Crown className="h-3 w-3 mr-1" />
                    {user.subscription}
                  </Badge>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(user.createdAt || user.joinDate)}
                </span>
              </div>

              {user.phone && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="text-sm font-medium text-gray-900">{user.phone}</span>
                </div>
              )}

              {user.bio && (
                <div className="py-2">
                  <span className="text-sm text-gray-600 block mb-1">Bio</span>
                  <p className="text-sm text-gray-900">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No user selected</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}