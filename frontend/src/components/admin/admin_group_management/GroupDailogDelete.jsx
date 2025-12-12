// src/components/admin/group_management/GroupDeleteAlertDialog.jsx
"use client"

import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function GroupDeleteAlertDialog({ isOpen, onOpenChange, handleDeleteHike, isDeleting, selectedHikeDetails }) {
  const confirmedParticipantsCount = selectedHikeDetails?.participants?.filter(p => p.status === 'confirmed').length || 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Group Hike?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel the group hike "{selectedHikeDetails?.title}" scheduled for {selectedHikeDetails?.date ? new Date(selectedHikeDetails.date).toLocaleDateString() : 'N/A'}. All{" "}
            {confirmedParticipantsCount} registered participants will be notified and refunded. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Hike</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteHike}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Cancelling..." : "Cancel Hike"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}