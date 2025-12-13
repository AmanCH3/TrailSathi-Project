import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Users } from 'lucide-react';
import { GroupDetails } from '../user_group_management/group_detail';
import { GroupCard } from '../user_group_management/group_card';

export function UserGroupsTab({ groups = [], user }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);

  if (!user) {
    return <div>Loading user data...</div>;
  }
  
  // This function will be passed to the `onView` prop of your GroupCard
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setDetailDialogOpen(true);
  };
  
  return (
    <>
      {/* We removed the outer Card wrapper to allow for a better grid layout */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-gray-700"/>
            <h2 className="text-2xl font-bold text-gray-800">My Groups ({groups.length})</h2>
        </div>
        
        {groups.length > 0 ? (
          // Use a grid layout to display the cards beautifully
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard 
                key={group._id} 
                group={group} 
                onView={handleSelectGroup} // <-- Pass the handler to the `onView` prop
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16 border-2 border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't joined or created any groups.</p>
          </div>
        )}
      </div>

      {/* Dialog to show full GroupDetails (This part remains the same) */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0">
          {selectedGroup && (
            <GroupDetails 
              group={selectedGroup} 
              user={user} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}