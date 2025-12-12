import { getRecentActivityApi } from "../api/activityApi";

export const getRecentActivityService = async () => {
  try {
    const response = await getRecentActivityApi();
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch recent activity" };
  }
};