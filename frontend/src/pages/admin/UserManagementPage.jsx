  "use client";

  import { useState } from "react";
  import { useAdminUser, useCreateUser, useDeleteUser, useUpdateUser } from "../../hooks/admin/userAdminUser";

  // UI & Icons
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Search, UserPlus, Users, Filter, AlertCircle } from "lucide-react";
  import { Skeleton } from "@/components/ui/skeleton";

  // Sub-components
  import { CreateUserDialog } from "../../components/admin/user_management/CreateUserDailog";
  import { ViewUserDialog } from "../../components/admin/user_management/ViewUserDailog";
  import { EditUserDialog } from "../../components/admin/user_management/EditUserDailog";
  import { DeleteUserDialog } from "../../components/admin/user_management/DeleteUserDailog";
  import { UserCard } from "../../components/admin/user_management/Usercard";
  import { UserActivityDialog } from "../../components/admin/user_management/UserActivityDialog";
  import { HikingLoader } from "../../components/common/HikingLoader";

  export default function UserManagementPage() {
    // --- 1. HOOKS PROVIDE ALL STATE & FUNCTIONS ---
    const { 
      users: backendUsers, 
      pagination, 
      isLoading, 
      isError, 
      error, 
      isFetching,
      page, 
      setPage, 
      searchTerm, 
      setSearchTerm 
    } = useAdminUser();
    
    const { mutate: createUser } = useCreateUser();
    const { mutate: deleteUser } = useDeleteUser();
    const { mutate: updateUser } = useUpdateUser();
   

    // --- UI STATE ---
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isViewOpen , setIsViewOpen] = useState(false)
    const [isActivityOpen, setIsActivityOpen] = useState(false)
    const [roleFilter, setRoleFilter] = useState("all");

    // --- FILTERING & HANDLERS ---
    const filteredUsers = backendUsers.filter((user) => {
      if (roleFilter === "all") return true;
      return (user.role?.toLowerCase() || 'user') === roleFilter;
    });

    const openEditDialog = (user) => { setSelectedUser(user); setIsEditOpen(true); };
    const openDeleteDialog = (user) => { setSelectedUser(user); setIsDeleteOpen(true); };
    const openViewDialog = (user) => {setSelectedUser(user); setIsViewOpen(true)}
    const openActivityDialog = (user) => { setSelectedUser(user); setIsActivityOpen(true); };
    
    const handleCreate = (formData) => {
      createUser(formData, { onSuccess: () => setIsCreateOpen(false) });
    };

    const handleUpdate = (id, data) => {
      updateUser({ id, data }, { onSuccess: () => setIsEditOpen(false) });
    };
    const handleDelete = () => {
      if (selectedUser) {
        deleteUser(selectedUser._id, { 
          onSuccess: () => {
            setIsDeleteOpen(false);
            setSelectedUser(null);
          }
        });
      }
    };

    return (
      <div className="space-y-6 p-4 md:p-8">
        {/* Header and Add User Button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage application users and their roles</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>

        {/* Filter & Search Card */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filter & Search</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="hiker">Hiker</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Grid with Loading/Error/Empty States */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <HikingLoader text="Loading users" />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <h3 className="mt-4 text-lg font-semibold">Failed to load users</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onEdit={() => openEditDialog(user)}
                  onDelete={() => openDeleteDialog(user)}
                  onView={() => openViewDialog(user)}
                  onViewActivity={() => openActivityDialog(user)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Users Found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* --- 2. PAGINATION CONTROLS RENDERED CONDITIONALLY --- */}
        {!isLoading && !isError && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            {/* Display current page info from the pagination object */}
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            {/* Previous/Next buttons */}
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                // Call the setter from the hook
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                // Disable on first page or during any fetch
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                // Call the setter from the hook
                onClick={() => setPage(p => p + 1)}
                // Disable on last page or during any fetch
                disabled={page === pagination.totalPages || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* --- DIALOGS --- */}
        <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreate={handleCreate} />
        {selectedUser && (
          <>
           <ViewUserDialog open={ isViewOpen} onOpenChange={ setIsViewOpen} user={selectedUser}/>
            <EditUserDialog open={isEditOpen} onOpenChange={setIsEditOpen} user={selectedUser} onUpdate={handleUpdate} />
            <DeleteUserDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} user={selectedUser} onDelete={handleDelete} />
            <UserActivityDialog 
              open={isActivityOpen} 
              onOpenChange={setIsActivityOpen} 
              userId={selectedUser._id} 
              userName={selectedUser.name} 
            />
          </>
        )}
      </div>
    );
  }

  const UserCardSkeleton = () => (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="mt-4 flex-1 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );