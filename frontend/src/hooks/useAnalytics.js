import { useQuery } from "@tanstack/react-query";
import { getAnalyticsService } from "../services/analyticsService";

export const useAnalytics = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsService,
  });

  return { data: data?.data, ...rest };
};