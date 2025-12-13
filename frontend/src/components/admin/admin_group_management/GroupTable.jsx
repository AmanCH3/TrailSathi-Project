// // src/components/admin/group_management/GroupTable.jsx
// "use client"

// import React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, MoreHorizontal, Users, MapPin, Eye, Edit, Trash2 } from "lucide-react"


// const getDifficultyColor = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//         case 'easy': return 'bg-green-100 text-green-800 hover:bg-green-100';
//         case 'moderate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
//         case 'difficult':
//         case 'hard': return 'bg-red-100 text-red-800 hover:bg-red-100';
//         default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
//     }
// }

// const getStatusColor = (status) => {
//   switch (status?.toLowerCase()) {
//     case "upcoming": return "default"
//     case "active": return "secondary"
//     case "completed": return "outline"
//     case "cancelled": return "destructive"
//     default: return "default"
//   }
// }


// export function GroupTable({
//   groups,
//   isLoading,
//   error,
//   pagination,
//   setPage,
//   searchTerm, 
//   setSearch, 
//   statusFilter,
//   setStatusFilter,
//   difficultyFilter,
//   setDifficultyFilter,
//   setSelectedHikeId,
//   setIsViewDialogOpen,
//   setIsEditDialogOpen,
//   setIsDeleteDialogOpen,
// })

// {


//   return (
//     <>
     
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search hikes by name, trail, or leader..."
//                 value={searchTerm} // Controlled by searchTerm from parent
//                 onChange={(e) => setSearch(e.target.value)} // Calls setSearch from parent (which updates useAllGroups)
//                 className="pl-10"
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="upcoming">Upcoming</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="completed">Completed</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="Filter by difficulty" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Difficulties</SelectItem>
//                 <SelectItem value="easy">Easy</SelectItem>
//                 <SelectItem value="moderate">Moderate</SelectItem>
//                 <SelectItem value="difficult">Difficult</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Hikes Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Group Hikes ({groups.length})</CardTitle>
//           <CardDescription>Manage scheduled and completed group hiking events</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <p>Loading group data...</p>
//           ) : error ? (
//             <p>Error loading groups: {error.message}</p>
//           ) : (
//             <>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Hike Details</TableHead>
//                     <TableHead>Leader</TableHead>
//                     <TableHead>Date & Time</TableHead>
//                     <TableHead>Participants</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {groups.map((group) => {
//                     const confirmedParticipantsCount = group.participants?.filter(p => p.status === 'confirmed').length || 0;
//                     return (
//                       <TableRow key={group._id}>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">{group.title}</div>
//                             <div className="text-sm text-muted-foreground flex items-center gap-1">
//                               <MapPin className="h-3 w-3" />
//                               {group.trail?.name || 'N/A'}
//                             </div>
//                             <Badge className={`mt-1 ${getDifficultyColor(group.difficulty)}`} variant="outline">
//                               {group.difficulty}
//                             </Badge>
//                           </div>
//                         </TableCell>
//                         {/* <TableCell>
//                           <div className="flex items-center space-x-2">
//                             <Avatar className="h-6 w-6">
//                               <AvatarImage src={group.leader.name?.profileImage || "/placeholder.svg"} alt={group.participants?.name} />
//                               <AvatarFallback>
//                                 {group.leader?.name?.split(" ").map((n) => n[0]).join("") || "L"}
//                               </AvatarFallback>
//                             </Avatar>
//                             <span className="text-sm">{group.leader?.name || "N/A"}</span>
//                           </div>
//                         </TableCell> */}
//                         <TableCell>
//   <div className="flex items-center space-x-2">
//     <Avatar className="h-6 w-6">
//       {/* This will now work correctly with the fixed controller */}
//       <AvatarImage src={group.leader?.profileImage} alt={group.leader?.name} />
//       <AvatarFallback>
//         {group.leader?.name?.split(" ").map((n) => n[0]).join("") || "L"}
//       </AvatarFallback>
//     </Avatar>
//     <span className="text-sm">{group.leader?.name || "N/A"}</span>
//   </div>
// </TableCell>
//                         <TableCell>
//                           <div>
//                             <div className="font-medium">{new Date(group.date).toLocaleDateString()}</div>
//                             <div className="text-sm text-muted-foreground">{new Date(group.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-1">
//                             <Users className="h-4 w-4 text-muted-foreground" />
//                             <span>
//                               {confirmedParticipantsCount}/{group.maxSize}
//                             </span>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant={getStatusColor(group.status)}>{group.status}</Badge>
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem
//                                 onClick={() => {
//                                   setSelectedHikeId(group._id)
//                                   setIsViewDialogOpen(true)
//                                 }}
//                               >
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 View and Manage Particpants
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() => {
//                                   setSelectedHikeId(group._id)
//                                   setIsEditDialogOpen(true)
//                                 }}
//                               >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 Edit Hike
//                               </DropdownMenuItem>
      
//                               <DropdownMenuItem className="text-destructive"
//                                 onClick={() => {
//                                   setSelectedHikeId(group._id)
//                                   setIsDeleteDialogOpen(true)
//                                 }}
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Cancel Hike
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//               {/* Pagination Controls */}
//               {pagination.totalPages > 1 && (
//                 <div className="flex justify-end gap-2 mt-4">
//                   {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
//                     <Button
//                       key={pageNumber}
//                       variant={pageNumber === pagination.page ? "default" : "outline"}
//                       onClick={() => setPage(pageNumber)}
//                       disabled={isLoading}
//                     >
//                       {pageNumber}
//                     </Button>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </>
//   )
// }



"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Users, MapPin, Eye, Edit, Trash2 } from "lucide-react"

// ✅ ADDED: API URL for constructing image paths
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'moderate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        case 'difficult':
        case 'hard': return 'bg-red-100 text-red-800 hover:bg-red-100';
        default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "upcoming": return "default"
    case "active": return "secondary"
    case "completed": return "outline"
    case "cancelled": return "destructive"
    default: return "default"
  }
}

export function GroupTable({
  groups,
  isLoading,
  error,
  pagination,
  setPage,
  searchTerm, 
  setSearch, 
  statusFilter,
  setStatusFilter,
  difficultyFilter,
  setDifficultyFilter,
  setSelectedHikeId,
  setIsViewDialogOpen,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
}) {
  return (
    <>
      <Card>
        <CardContent className="pt-6">
            {/* ... Filters ... */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Hikes ({groups.length})</CardTitle>
          <CardDescription>Manage scheduled and completed group hiking events</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? ( <p>Loading group data...</p> ) : 
           error ? ( <p>Error loading groups: {error.message}</p> ) : 
           (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hike Details</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => {
                    const confirmedParticipantsCount = group.participants?.filter(p => p.status === 'confirmed').length || 0;
                    return (
                      <TableRow key={group._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{group.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {group.trail?.name || 'N/A'}
                            </div>
                            <Badge className={`mt-1 ${getDifficultyColor(group.difficulty)}`} variant="outline">
                              {group.difficulty}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              {/* ✅ CORRECTED: Added server URL */}
                              <AvatarImage src={group.leader?.profileImage ? `${API_URL}${group.leader.profileImage}` : ''} alt={group.leader?.name} />
                              <AvatarFallback>
                                {group.leader?.name?.split(" ").map((n) => n[0]).join("") || "L"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{group.leader?.name || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{new Date(group.date).toLocaleDateString()}</div>
                            <div className="text-sm text-muted-foreground">{new Date(group.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {confirmedParticipantsCount}/{group.maxSize}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(group.status)}>{group.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedHikeId(group._id)
                                  setIsViewDialogOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedHikeId(group._id)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Hike
                              </DropdownMenuItem>
      
                              <DropdownMenuItem className="text-destructive"
                                onClick={() => {
                                  setSelectedHikeId(group._id)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Hike
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}