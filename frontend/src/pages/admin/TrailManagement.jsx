// src/app/admin/trails/page.jsx (Corrected and Complete)
"use client";

import { useState } from "react";
import { useAdminTrail, useCreateTrail, useDeleteOneTrail, useUpdateOneTrail } from "../../hooks/admin/useAdminTrail";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Plus } from "lucide-react";

import { CreateTrailDialog } from "../../components/admin/trail_management/CreateTrailDailog";
import { ViewTrailDialog } from "../../components/admin/trail_management/ViewTrailDailog";
import { EditTrailDialog } from "../../components/admin/trail_management/EditTrailDailog";
import { DeleteTrailDialog } from "../../components/admin/trail_management/DeleteDailogTrail";
import { TrailCard } from "../../components/admin/trail_management/TrailCard";



export default function TrailManagementPage() {
  // --- HOOKS ---
  // Note: Your hook was named useAdminTrail, but your mutations were separate.
  // Let's call them all for full functionality.
  const { trails, isLoading, error, setFilters } = useAdminTrail();
  const { mutate: createTrail } = useCreateTrail();
  const { mutate: deleteTrail } = useDeleteOneTrail();
  const { mutate: updateTrail } = useUpdateOneTrail();

  // --- STATE ---
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); // ADDED
  const [isEditOpen, setIsEditOpen] = useState(false); // ADDED
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- HANDLERS ---
  const handleSearchChange = (e) => {
    setFilters(prevFilters => ({ ...prevFilters, search: e.target.value, page: 1 }));
  };

  const openViewDialog = (trail) => { // ADDED
    setSelectedTrail(trail);
    setIsViewOpen(true);
  };

  const openEditDialog = (trail) => { // ADDED
    setSelectedTrail(trail);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (trail) => {
    setSelectedTrail(trail);
    setIsDeleteOpen(true);
  };

  const handleCreate = (formData) => {
    createTrail(formData);
    setIsCreateOpen(false);
  };

  const handleUpdate = (id, data) => {
    updateTrail({ id, data });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (selectedTrail) {
      deleteTrail(selectedTrail._id);
      setIsDeleteOpen(false);
      setSelectedTrail(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trail Management</h1>
          <p className="text-muted-foreground">Manage hiking trails and routes</p>
        </div>
        {/* ADDED a button to trigger the create dialog */}
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Trail
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trails by name..."
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading && <p className="text-center">Loading trails...</p>}
      {error && <p className="text-center text-destructive">{error.message}</p>}
      
      {!isLoading && !error && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trails.map((trail) => (
              <TrailCard
                key={trail._id}
                trail={trail}
                // WIRED UP all the handlers
                onView={() => openViewDialog(trail)}
                onEdit={() => openEditDialog(trail)}
                onDelete={() => openDeleteDialog(trail)}
              />
            ))}
          </div>

          {trails.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Trails Found</h3>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* RENDER all the dialogs */}
      <CreateTrailDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
      />
      <ViewTrailDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        trail={selectedTrail}
      />
      <EditTrailDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        trail={selectedTrail}
        onUpdate={handleUpdate}
      />
      <DeleteTrailDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        trail={selectedTrail}
        onDelete={handleDelete}
      />
    </div>
  );
}