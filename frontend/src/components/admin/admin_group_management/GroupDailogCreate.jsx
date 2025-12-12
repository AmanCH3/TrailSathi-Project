// src/components/admin/group_management/GroupCreateDialog.jsx
"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card ,CardHeader , CardTitle , CardDescription, CardContent} from "@/components/ui/card"
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, ImageIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCreateGroup } from "../../../hooks/useGroup"
import { useAdminTrail } from "../../../hooks/admin/useAdminTrail"
import { useAdminUser } from "../../../hooks/admin/userAdminUser"
import { toast } from "react-toastify"

const FormError = ({ children }) => <p className="text-red-500 text-xs mt-1">{children}</p>;
const validationSchema = Yup.object({
  title: Yup.string().required("Group title is required"),
  trail: Yup.string().required("Please select a trail"),
  leader: Yup.string().required("Please select a leader"),
  date: Yup.date().required("A date is required").min(new Date(), "Date cannot be in the past"),
  description: Yup.string(),
  maxSize: Yup.number().required("Max size is required").min(2, "Group size must be at least 2"),
  difficulty: Yup.string().required("Difficulty is required"),
  meetingPoint: Yup.string().required("Meeting point is required"),
  requirements: Yup.array().of(Yup.string()),
  // Validate the array of files
  photos: Yup.array().max(5, "You can upload a maximum of 5 images"),
});

export function CreateGroupFormAdmin({ user, onSuccess }) {
  const { mutate: createGroup, isPending: isLoading } = useCreateGroup();
  const { trails: availableTrails = [] } = useAdminTrail();
  const { users: availableLeaders = [] } = useAdminUser();

  // State for UI elements that are not part of Formik's core data
  const [newRequirement, setNewRequirement] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  // --- 2. Initialize Formik ---
  const formik = useFormik({
    // Set initial values for all form fields
    initialValues: {
      title: "",
      trail: "",
      leader: "",
      date: null,
      description: "",
      maxSize: 6,
      difficulty: "moderate",
      meetingPoint: "",
      requirements: [],
      photos: [], 
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!user?._id) {
        toast.error("Authentication error. Please log in again.");
        return;
      }
      
      const submissionData = new FormData();
      
      // Append form values to FormData
      submissionData.append("title", values.title);
      submissionData.append("description", values.description);
      submissionData.append("maxSize", values.maxSize);
      submissionData.append("meetingPoint", values.meetingPoint);
      submissionData.append("trail", values.trail);
      submissionData.append("date", values.date.toISOString());
      submissionData.append("difficulty", values.difficulty);
      submissionData.append("leader", values.leader);
      submissionData.append("status", "upcoming");

      // Append arrays correctly
      values.photos.forEach(file => {
        submissionData.append("photo", file); // API expects 'photo'
      });

      values.requirements.forEach(req => {
        submissionData.append("requirements[]", req);
      });

      createGroup(submissionData, {
        onSuccess: () => {
          // Clean up previews and call parent's onSuccess function
          imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
          if (onSuccess) onSuccess(); 
        },
      });
    },
  });

  // --- 3. Custom Handlers that interact with Formik state ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Combine with existing files and set in Formik
    const allFiles = [...formik.values.photos, ...files];
    formik.setFieldValue("photos", allFiles);

    // Update UI previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };
  
  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    formik.setFieldValue("photos", formik.values.photos.filter((_, i) => i !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };
  
  const addRequirement = () => {
    const trimmed = newRequirement.trim();
    if (trimmed && !formik.values.requirements.includes(trimmed)) {
      formik.setFieldValue("requirements", [...formik.values.requirements, trimmed]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (reqToRemove) => {
    formik.setFieldValue("requirements", formik.values.requirements.filter(r => r !== reqToRemove));
  };


  return (
    // Use formik.handleSubmit for the form's onSubmit event
    <form onSubmit={formik.handleSubmit}>
      <Card className="border-none">
        <CardHeader>
          <CardTitle>Create a New Hiking Group</CardTitle>
          <CardDescription>Fill in the details to schedule a new hike.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* --- 4. Connect UI Inputs to Formik --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Group Title</Label>
                {/* getFieldProps connects value, onChange, onBlur, and name */}
                <Input id="title" {...formik.getFieldProps('title')} placeholder="e.g., Sunrise Hike to Nagarkot" />
                {formik.touched.title && formik.errors.title && <FormError>{formik.errors.title}</FormError>}
              </div>

              <div>
                <Label htmlFor="trail">Trail</Label>
                {/* For custom components like Select, wire them up manually */}
                <Select name="trail" onValueChange={value => formik.setFieldValue('trail', value)} onOpenChange={() => formik.setFieldTouched('trail', true)}>
                  <SelectTrigger><SelectValue placeholder="Choose a trail" /></SelectTrigger>
                  <SelectContent>
                    {availableTrails.map(trail => <SelectItem key={trail._id} value={trail._id}>{trail.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formik.touched.trail && formik.errors.trail && <FormError>{formik.errors.trail}</FormError>}
              </div>
              
              <div>
                <Label htmlFor="leader">Leader</Label>
                <Select name="leader" onValueChange={value => formik.setFieldValue('leader', value)} onOpenChange={() => formik.setFieldTouched('leader', true)}>
                  <SelectTrigger><SelectValue placeholder="Choose a leader" /></SelectTrigger>
                  <SelectContent>
                    {availableLeaders.map(leader => <SelectItem key={leader._id} value={leader._id}>{leader.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formik.touched.leader && formik.errors.leader && <FormError>{formik.errors.leader}</FormError>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...formik.getFieldProps('description')} placeholder="Describe the hike..." />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formik.values.date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formik.values.date ? format(formik.values.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formik.values.date} onSelect={value => formik.setFieldValue('date', value)} onDayBlur={() => formik.setFieldTouched('date', true)} initialFocus />
                  </PopoverContent>
                </Popover>
                {formik.touched.date && formik.errors.date && <FormError>{formik.errors.date}</FormError>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxSize">Max Group Size</Label>
                  <Input id="maxSize" type="number" {...formik.getFieldProps('maxSize')} />
                  {formik.touched.maxSize && formik.errors.maxSize && <FormError>{formik.errors.maxSize}</FormError>}
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" value={formik.values.difficulty} onValueChange={value => formik.setFieldValue('difficulty', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="difficult">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="meetingPoint">Meeting Point</Label>
                <Input id="meetingPoint" {...formik.getFieldProps('meetingPoint')} placeholder="e.g., Jawalakhel Bus Stop" />
                {formik.touched.meetingPoint && formik.errors.meetingPoint && <FormError>{formik.errors.meetingPoint}</FormError>}
              </div>
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div>
            <Label>Cover Images (Up to 5)</Label>
            <Input id="photos" type="file" accept="image/*" onChange={handleImageChange} className="mt-2" multiple />
            {formik.touched.photos && formik.errors.photos && <FormError>{formik.errors.photos}</FormError>}
            <div className="mt-4 flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-32 h-20">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => handleRemoveImage(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Requirements Section */}
          <div>
            <Label>Requirements (Optional)</Label>
            <div className="flex gap-2">
              <Input value={newRequirement} onChange={(e) => setNewRequirement(e.target.value)} placeholder="e.g., Hiking Boots..." />
              <Button type="button" onClick={addRequirement}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formik.values.requirements.map((req) => (
                <span key={req} className="bg-secondary text-secondary-foreground px-3 py-1 text-sm rounded-full flex items-center">
                  {req}
                  <X className="ml-2 cursor-pointer w-4 h-4 hover:text-destructive" onClick={() => removeRequirement(req)} />
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? "Creating Group..." : "Create Group"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}