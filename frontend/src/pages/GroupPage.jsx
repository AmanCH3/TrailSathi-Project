import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroup } from "../hooks/useGroup";
import { GroupCard } from "../components/user_group_management/group_card";
import { GroupDetails } from "../components/user_group_management/group_detail";
import { CreateGroupForm } from "../components/user_group_management/create_group_form";
import { useAuth } from '../app/providers/AuthProvider';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GroupsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { group: allGroups, isLoading } = useGroup();

  console.log("GroupsPage Rendered. User:", user);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  // ... pagination logic ...

  const groupsPerPage = 6;
  const totalPages = Math.ceil(allGroups.length / groupsPerPage);

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = allGroups.slice(indexOfFirstGroup, indexOfLastGroup);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleViewDetails = (groupToShow) => {
    setSelectedGroup(groupToShow);
  };

  const handleCloseDetails = () => {
    setSelectedGroup(null);
  };

  return (
    <main className="container mx-auto pt-20 pb-16">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-2 p-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Hiking Groups
          </h1>
          <p className="text-gray-600 mt-1">
            Join existing hiking groups or create your own
          </p>
        </div>
        
        {/* Debug: Force button rendering check */}
        <Button 
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => {
            console.log("Create Group Clicked. Subscription:", user?.subscription);
            if (!['Pro', 'Premium'].includes(user?.subscription)) {
              navigate('/payments');
              return;
            }
            setCreateGroupOpen(true);
          }}
        >
          + Create Group
        </Button>

        <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
          <DialogContent className="max-w-3xl p-6">
            <DialogHeader>
              <DialogTitle>Create a New Hiking Group</DialogTitle>
              <DialogDescription>
                Fill out the details below to start a new adventure.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-4">
              <CreateGroupForm
                user={user}
                onSuccess={() => setCreateGroupOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {allGroups.length === 0 && (
        <p className="text-center">No groups found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {currentGroups.map((g) => (
          <GroupCard key={g._id} group={g} onView={handleViewDetails} />
        ))}
      </div>

      {allGroups.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Only render the Dialog when selectedGroup exists */}
      {selectedGroup && (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && handleCloseDetails()}>
          <DialogContent className="max-w-4xl p-0 border-0">
            <GroupDetails
              group={selectedGroup}
              user={user}
              onClose={handleCloseDetails}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
