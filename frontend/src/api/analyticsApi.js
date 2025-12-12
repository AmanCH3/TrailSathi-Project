import axios from "./api";

export const getAnalyticsApi = () => axios.get("/analytics");