"use client";

import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/interfaces/user";

interface Props {
  userId: number;
}

async function getUserById({ userId }: Props): Promise<User> {
  const { data } = await api.get<User>(`/users/${userId}`);
  return data;
}

export function useUserById({ userId }: Props) {
  return useQuery({
    queryKey: ["my-user", { userId }],
    refetchOnWindowFocus: false,
    queryFn: () => getUserById({ userId }),
  });
}
