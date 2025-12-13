// import { useQuery } from "@tanstack/react-query";
// import { getRecentActivityService } from "../services/activityService";

// export const useRecentActivity = () => {
//   const { data, ...rest } = useQuery({
//     queryKey: ["activity"],
//     queryFn: getRecentActivityService,
//   });

//   return { data: data?.data, ...rest };
// };



import { useQuery } from "@tanstack/react-query";
import { getRecentActivityService } from "../services/activityService";

export const useRecentActivity = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["activity"],
    queryFn: getRecentActivityService,
  });

  // FIX: Make sure to return the nested 'data' array from the response
  return { data: data?.data, ...rest };
};