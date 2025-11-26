"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function HomeRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (user.role === "ADMIN") {
      router.push("/home-admin");
      return;
    }

    if (user.role === "CLIENT") {
      router.push("/home-client");
      return;
    }
  }, [user, router]);

  return null;
}
