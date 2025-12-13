import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUserService, createOneUserService, updateOneUserSerivce, deleteOneUserService } from "../../services/admin/userService";
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';

// A reusable debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- The Main Hook for Fetching Users ---
export const useAdminUser = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9); // A limit divisible by 3 works well for a 3-column grid
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce the search term to improve performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const query = useQuery({
    // The query key is now dynamic. React Query refetches when any of these change.
    queryKey: ["admin_users", { page, limit, search: debouncedSearchTerm }],
    queryFn: () => getAllUserService({ page, limit, search: debouncedSearchTerm }),
    keepPreviousData: true, // Prevents UI flicker during pagination
  });

  // CRITICAL: Reset page to 1 ONLY when a new search is initiated.
  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  return {
    // Pass through all query results
    ...query,
    // Provide clean, safe-to-use data structures
    users: query.data?.data || [],
    pagination: query.data?.pagination || {},
    // Expose state and setters for the component to control the query
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm
  };
};


// --- Your Mutation Hooks (These are already well-structured) ---
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOneUserService,
    onSuccess: () => {
      // Invalidate the entire list query to refetch data
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("User created successfully");
    },
    onError: (err) => toast.error(err.message || "Failed to create user")
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateOneUserSerivce(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("User updated successfully");
    },
    onError: (err) => toast.error(err.message || "Failed to update user")
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOneUserService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("User deleted successfully");
    },
    onError: (err) => toast.error(err.message || "Failed to delete user")
  });
};