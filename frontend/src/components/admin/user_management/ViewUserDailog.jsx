import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Mountain, 
  Mail,
  User
} from "lucide-react";

export function ViewUserDialog({ open, onOpenChange, user }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'guide': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'member': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold">User Profile</DialogTitle>
          <DialogDescription className="text-base">
            Complete profile information for {user?.name || "this user"}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="space-y-8">
            {/* Header Section with Avatar and Basic Info */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"></div>
              <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {(user.name || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${
                      user.status === "Active" ? "bg-green-500" : "bg-gray-400"
                    }`}></div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.name || "Unknown User"}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 break-all">{user.email || "No email provided"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      className={`${getRoleColor(user.role)} border font-medium`}
                      variant="outline"
                    >
                      <User className="h-3 w-3 mr-1" />
                      {user.role || "Member"}
                    </Badge>
                    <Badge 
                      className={`${getStatusColor(user.status)} border font-medium`}
                      variant="outline"
                    >
                      {user.status || "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mountain className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hikes Completed</p>
                    <p className="text-2xl font-bold text-green-700">
                      {user.hikesCompleted || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-sm font-semibold text-blue-700">
                      {formatDate(user.joinDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Active</p>
                    <p className="text-sm font-semibold text-purple-700">
                      {formatDateTime(user.lastActive)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                  </div>
                  <p className="text-sm text-gray-900 pl-6">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <Label className="text-sm font-medium text-gray-700">Address</Label>
                  </div>
                  <p className="text-sm text-gray-900 pl-6">
                    {user.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(user.bio || user.experience || user.certifications) && (
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
                
                {user.bio && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Biography</Label>
                    <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                  </div>
                )}
                
                {user.experience && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Experience</Label>
                    <p className="text-sm text-gray-600 mt-1">{user.experience}</p>
                  </div>
                )}
                
                {user.certifications && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Certifications</Label>
                    <p className="text-sm text-gray-600 mt-1">{user.certifications}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-gray-100 rounded-full mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No user selected</h3>
            <p className="text-gray-500">Please select a user to view their profile information.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}