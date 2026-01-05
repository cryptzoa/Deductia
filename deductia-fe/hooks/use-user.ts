import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User, ApiResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useUser({ redirect = true } = {}) {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      
      if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        return null;
      }
      const { data } = await api.get<ApiResponse<User>>("/me");
      return data.data;
    },
    retry: false,
    enabled: true, 
  });

  useEffect(() => {
    if (redirect && isError) {
      router.push("/login");
    }
  }, [isError, redirect, router]);

  return { user, isLoading, isError };
}
