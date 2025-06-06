'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType, FC } from "react";
import { FullSpinLoader } from "@/components/ui/spin-loader";

export default function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): FC<P> {
  const AuthenticatedComponent: FC<P> = (props: P) => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.replace("/");
      }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
      return <FullSpinLoader />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
}
