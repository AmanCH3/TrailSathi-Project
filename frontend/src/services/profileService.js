import api from "../api/api";

// This function calls the correct endpoint: PUT /api/user/update
// It sends the data as FormData to handle the image upload
export const updateMyProfile = async (formData) => {
  const { data } = await api.put("/user/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};