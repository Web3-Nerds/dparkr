import { useEffect, useState } from "react";
import axios from "axios";

interface UserProfileData {
  name: string;
  email: string;
  image: string;
  provider: string;
  role: string;
  joinedAt?: string;
}

export function useUserProfile() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<UserProfileData>("/api/user/profile");
        setUserData(response.data);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            const { status, data } = err.response;

            if (status === 401) {
              setError("Authentication required. Please sign in again.");
            } else if (status === 404) {
              setError("User data not found.");
            } else {
              setError(`Failed to fetch user data: ${status} ${data?.message || ""}`);
            }

            console.error("API Error:", data?.message);
          } else {
            setError("No response received from the server.");
          }
        } else {
          console.error("Unexpected Error:", err);
          setError("An unexpected error occurred while fetching user data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
}
