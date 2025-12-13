// src/components/admin/group_management/GroupEditDialog.jsx
"use client"

import React, { useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function GroupEditDialog({ isOpen, onOpenChange, formData, setFormData, handleUpdateHike, isUpdating, selectedHikeDetails }) {

  useEffect(() => {
    if (isOpen && selectedHikeDetails) {
      setFormData({
        title: selectedHikeDetails.title || "",
        trail: selectedHikeDetails.trail?._id || "", // Use ID for selection
        date: selectedHikeDetails.date ? new Date(selectedHikeDetails.date).toISOString().split('T')[0] : "", // Format for date input
        guide: selectedHikeDetails.leader?._id || "", // Use ID for selection
        maxSize: selectedHikeDetails.maxSize || 10,
        difficulty: selectedHikeDetails.difficulty || "Easy",
        description: selectedHikeDetails.description || "",
        requirements: selectedHikeDetails.requirements?.[0] || "", // Assuming one string for requirements input
        meetingPoint: selectedHikeDetails.meetingPoint?.description || "",
      })
    }
  }, [isOpen, selectedHikeDetails, setFormData])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group Hike</DialogTitle>
          <DialogDescription>Update hike information and settings</DialogDescription>
        </DialogHeader>
        {selectedHikeDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-hike-name">Hike Name *</Label>
                <Input
                  id="edit-hike-name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-hike-trail">Trail *</Label>
                <Select value={formData.trail} onValueChange={(value) => setFormData({ ...formData, trail: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Dynamically fetch and display trails here */}
                    <SelectItem value="6839572e2dc7f0fb0d12971b">Emerald Ridge Trail</SelectItem>
                    <SelectItem value="trail_id_2">Sunset Ridge Path</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-hike-date">Date *</Label>
                <Input
                  id="edit-hike-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-hike-max-participants">Max Participants</Label>
                <Input
                  id="edit-hike-max-participants"
                  type="number"
                  min="2"
                  max="20"
                  value={formData.maxSize}
                  onChange={(e) => setFormData({ ...formData, maxSize: Number.parseInt(e.target.value) || 10 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-hike-difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Difficult">Difficult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-hike-guide">Leader *</Label>
                <Select value={formData.guide} onValueChange={(value) => setFormData({ ...formData, guide: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Dynamically fetch users with 'guide' or 'admin' roles for this */}
                    <SelectItem value="68582ff880cf997be402de78">John Doe (Guide)</SelectItem>
                    <SelectItem value="user_id_2">Jane Smith (Guide)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-hike-meeting">Meeting Point</Label>
                <Input
                  id="edit-hike-meeting"
                  value={formData.meetingPoint}
                  onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                  placeholder="Where participants should meet"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-hike-description">Description</Label>
              <Textarea
                id="edit-hike-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-hike-requirements">Requirements</Label>
              <Textarea
                id="edit-hike-requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateHike}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Hike"}
              </Button>
            </div>
          </div>
        ) : (
          <p>Loading details for edit...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}