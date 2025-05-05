import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data ?? null;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { follow, isPending };
};

// auth
export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    mutate: authUser,
    isError,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.error("Authentication error:", error);
    },
  });

  return {
    authUser,
    isError,
    isLoading,
    error,
  };
};
