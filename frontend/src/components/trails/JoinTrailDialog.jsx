import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useJoinTrailWithDate } from '../../hooks/admin/useAdminTrail';

export function JoinTrailDialog({ trail, isOpen, onOpenChange }) {
  const [date, setDate] = React.useState(new Date());
  const { mutate: joinTrail, isPending } = useJoinTrailWithDate();

  const handleJoin = () => {
    if (!trail || !date) return;
    
    joinTrail(
      { id: trail._id, data: { scheduledDate: date.toISOString() } },
      {
        onSuccess: () => {
          onOpenChange(false); // Close the dialog on success
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Your Hike</DialogTitle>
          <DialogDescription>
            Select a date to join the trail: <strong>{trail?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleJoin} disabled={isPending || !date}>
            {isPending ? "Scheduling..." : "Confirm Hike"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}