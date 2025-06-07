import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  provider: string;
  role: string;
  joinedAt?: string;
}

const fetchUserData = async (): Promise<UserProfileData> => {
  try {
    const response = await axios.get<UserProfileData>("/api/user/profile");
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          throw new Error("Authentication required. Please sign in again.");
        } else if (status === 404) {
          throw new Error("User data not found.");
        } else {
          throw new Error(`Failed to fetch user data: ${status} ${data?.message || ""}`);
        }
      } else {
        throw new Error("No response received from the server.");
      }
    } else {
      console.error("Unexpected Error:", err);
      throw new Error("An unexpected error occurred while fetching user data.");
    }
  }
};

export function useGetUser() {
  const {
    data: userData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserData,
    retry: (failureCount, error) => {
      if (error.message.includes("Authentication required")) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
  });

  return {
    userData: userData || null,
    loading,
    error: error?.message || null,
  };
}
