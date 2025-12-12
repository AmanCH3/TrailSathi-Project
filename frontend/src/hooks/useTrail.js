import { useQuery } from "@tanstack/react-query";
import { getOneApiTrailApi } from "../api/admin/trailApi";

export const useTrail = (id) => {
  return useQuery({
    queryKey: ["trail", id],
    queryFn: () => getOneApiTrailApi(id),
    enabled: !!id,
    select: (data) => data.data.data.trail,
  });
};
