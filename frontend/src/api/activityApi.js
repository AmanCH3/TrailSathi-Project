import axios from "./api";

export const getRecentActivityApi = () => axios.get("/activity");