'use client'

import UserProfile from "@/components/user/UserProfile";
import withAuth from "@/lib/withAuth";
import { FullSpinLoader } from "@/components/ui/spin-loader";
import { useGetUser } from "@/hooks/userProfile";

function Page() {
  const { userData, loading, error } = useGetUser();

  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  if (loading || !userData) return <FullSpinLoader />

  return <UserProfile user={userData} />;
}

export default withAuth(Page);
