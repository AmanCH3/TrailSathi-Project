"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, XCircle, Clock, Users } from "lucide-react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api"

// API Functions
const getPendingGroups = async () => {
  const token = localStorage.getItem('token')
  const { data } = await axios.get(`${API_URL}/groups/pending-groups`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data.data.groups
}

const approveGroup = async (groupId) => {
  const token = localStorage.getItem('token')
  const { data } = await axios.patch(`${API_URL}/groups/${groupId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data
}

const rejectGroup = async ({ groupId, reason }) => {
  const token = localStorage.getItem('token')
  const { data } = await axios.patch(`${API_URL}/groups/${groupId}/reject`, 
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return data
}

export function PendingGroupsManagement() {
  const queryClient = useQueryClient()
  const [rejectingGroupId, setRejectingGroupId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Fetch pending groups
  const { data: pendingGroups = [], isLoading } = useQuery({
    queryKey: ['pending-groups'],
    queryFn: getPendingGroups,
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: approveGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-groups'] })
      alert('Group approved successfully!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to approve group')
    }
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: rejectGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-groups'] })
      setRejectingGroupId(null)
      setRejectionReason("")
      alert('Group rejected successfully!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to reject group')
    }
  })

  const handleApprove = (groupId) => {
    if (confirm('Are you sure you want to approve this group?')) {
      approveMutation.mutate(groupId)
    }
  }

  const handleReject = (groupId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    rejectMutation.mutate({ groupId, reason: rejectionReason })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pending Groups</h2>
        <p className="text-muted-foreground">
          Review and approve or reject group creation requests
        </p>
      </div>

      {pendingGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending groups to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingGroups.map((group) => (
            <Card key={group._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.owner?.profileImage} />
                      <AvatarFallback>
                        {group.owner?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>
                        Created by <span className="font-medium">{group.owner?.name}</span>
                        <br />
                        <span className="text-xs">
                          {new Date(group.createdAt).toLocaleDateString()} at{' '}
                          {new Date(group.createdAt).toLocaleTimeString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {group.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{group.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Privacy</p>
                    <Badge variant="secondary">{group.privacy}</Badge>
                  </div>
                </div>

                {group.tags && group.tags.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  {rejectingGroupId === group._id ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Rejection Reason</label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a reason for rejecting this group..."
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReject(group._id)}
                          disabled={rejectMutation.isPending}
                          variant="destructive"
                          size="sm"
                        >
                          {rejectMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Confirm Rejection
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setRejectingGroupId(null)
                            setRejectionReason("")
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(group._id)}
                        disabled={approveMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {approveMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Group
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setRejectingGroupId(group._id)}
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        size="sm"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Group
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
