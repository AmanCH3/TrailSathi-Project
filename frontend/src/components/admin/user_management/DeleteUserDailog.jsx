"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// 1. Changed props from 'trail' to 'user'
export function DeleteUserDialog({ open, onOpenChange, user, onDelete }) {
  // 2. Check for 'user' instead of 'trail' to prevent errors
  if (!user) {
    return null;
  }
  
  const handleDelete = () => {
    // 3. Call onDelete with user._id (assuming MongoDB ID)
    onDelete(user._id);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {/* 4. Updated text to refer to a user account */}
            This action cannot be undone. This will permanently delete the user
            <span className="font-semibold"> "{user.name}"</span> and all of
            their associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {/* 5. Updated button text */}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}