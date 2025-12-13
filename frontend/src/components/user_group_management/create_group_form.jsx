"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use react-router-dom hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Clock, Mountain, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateGroup } from "../../hooks/useGroup"; 
import { useAdminTrail } from "../../hooks/admin/useAdminTrail"; 
import { toast } from "react-toastify";

export function CreateGroupForm({ user, onSuccess }) {
  const navigate = useNavigate();
  const { mutate: createGroup, isPending: isLoading } = useCreateGroup();
  const { trails: availableTrails } = useAdminTrail();

  const [selectedTrail, setSelectedTrail] = useState(null);
  const [date, setDate] = useState();
  const [requirements, setRequirements] = useState([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxSize: 6,
    meetingPoint: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleTrailSelect = (trailId) => {
    const trail = availableTrails.find((t) => t._id === trailId);
    setSelectedTrail(trail);
  };

  const addRequirement = () => {
    const trimmed = newRequirement.trim();
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements([...requirements, trimmed]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (req) => {
    setRequirements(requirements.filter((r) => r !== req));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User must be logged in");
      return;
    }

    if (!selectedTrail || !date) {
      toast.error("Please select a trail and date");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("maxSize", formData.maxSize);
    submissionData.append("date", date.toISOString());
    submissionData.append("trail", selectedTrail._id);
    submissionData.append("meetingPoint", formData.meetingPoint);
    if (formData.image) {
      submissionData.append("image", formData.image);
    }
    requirements.forEach((req) => submissionData.append("requirements[]", req));

    createGroup(submissionData, {
      onSuccess: () => {
        toast.success("Group created successfully!");
        onSuccess?.(); 
        navigate("/groups");
      },
      onError: (error) => {
        toast.error("Failed to create group");
        console.error(error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input name="title" value={formData.title} onChange={handleInputChange} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleInputChange} />
      </div>

      <div>
        <Label>Meeting Point</Label>
        <Input name="meetingPoint" value={formData.meetingPoint} onChange={handleInputChange} />
      </div>

      <div>
        <Label>Max Group Size</Label>
        <Input
          name="maxSize"
          type="number"
          value={formData.maxSize}
          onChange={handleInputChange}
          min={1}
        />
      </div>

      <div>
        <Label>Trail</Label>
        <Select onValueChange={handleTrailSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a trail" />
          </SelectTrigger>
          <SelectContent>
            {availableTrails.map((trail) => (
              <SelectItem key={trail._id} value={trail._id}>
                {trail.name} - {trail.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div>
        <Label>Requirements</Label>
        <div className="flex gap-2">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Add a requirement"
          />
          <Button type="button" onClick={addRequirement}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {requirements.map((req) => (
            <span
              key={req}
              className="bg-gray-200 px-2 py-1 rounded flex items-center"
            >
              {req}
              <X
                className="ml-1 cursor-pointer w-4 h-4 text-red-500"
                onClick={() => removeRequirement(req)}
              />
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Group"}
        </Button>
      </div>
    </form>
  );
}