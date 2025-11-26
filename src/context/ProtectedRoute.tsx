"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner, Center, Text } from "@chakra-ui/react";
import { useAuth } from "./AuthProvider";
import { UserRole } from "@/interfaces/common";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      }
    }
  }, [user, loading, router]);

  if (loading || user === null) {
    return (
      <Center mt={10}>
        <Spinner size="lg" />
      </Center>
    );
  }
  
  if (roles && !roles.includes(user.role)) {
    return (
      <Center mt={10} flexDirection="column">
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Acesso Negado
        </Text>
        <Text>Você não tem permissão para acessar esta página.</Text>
      </Center>
    );
  }

  return <>{children}</>;
};
