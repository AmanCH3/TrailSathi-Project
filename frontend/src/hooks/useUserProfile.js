import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/api";
import { toast } from "react-toastify";

// API function to get the current user's profile
const fetchMyProfile = async () => {
  const { data } = await axios.get("/user/me");
  return data.data;
};

// API function to update the current user's profile
const updateMyProfile = async (profileData) => {
  const { data } = await axios.put("/user/me", profileData);
  return data.data;
};

// ✅ ADDED: API function to update profile picture
const updateMyProfilePicture = async (formData) => {
  const { data } = await axios.put("/user/me/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

// Hook to get the user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Hook to update the user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });
};

// ✅ ADDED: Hook to update profile picture
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile picture updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update picture.");
    },
  });
};