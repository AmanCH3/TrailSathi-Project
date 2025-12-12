// src/components/JoinGroupDialog.jsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";

export function JoinGroupDialog({ open, setOpen, groupTitle, onJoin }) {
  const [message, setMessage] = useState("");

  const handleJoin = () => {
    // Pass the message state to the callback and close the dialog
    onJoin({ message });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join "{groupTitle}"</DialogTitle>
          <DialogDescription>
            Your request will be sent to the group admin for approval. You can add an optional message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* This section is now uncommented to allow user input */}
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your Message (Optional)</Label>
            <Textarea
              placeholder="Tell the admin why you'd like to join..."
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleJoin}>Send Join Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}