import { getAnalyticsApi } from "../api/analyticsApi";

export const getAnalyticsService = async () => {
  try {
    const response = await getAnalyticsApi();
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch analytics data" };
  }
};