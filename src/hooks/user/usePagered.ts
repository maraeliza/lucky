"use client";

import { PaginationData } from "@/interfaces/common";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { GetUserResponse, UserResponse, UsersFilterState } from "@/interfaces/user";

interface Props {
  page: number;
  limit: number;
  filters: UsersFilterState;
}

async function getUsers({
  page,
  limit,
  filters,
}: Props): Promise<GetUserResponse> {
  try {
    const response = await api
      .get("/users", { params: { page, limit, ...filters } })
      .then((res) => res.data);

    const data: UserResponse[] = response.data;

    const meta: PaginationData = {
      currentPage: response.meta.page,
      registerPerPage: response.meta.limit,
      totalCountofRegisters: response.meta.total,
      lastPage: response.meta.lastPage,
    };
    return { data, meta };
  } catch (error) {
    console.error("Erro buscando itens:", error);

    return {
      data: [],
      meta: {
        currentPage: 0,
        registerPerPage: 0,
        totalCountofRegisters: 0,
        lastPage: 0,
      },
    };
  }
}

export function useUsers({ page, limit, filters }: Props) {
  return useQuery({
    queryKey: ["users", { page, limit, filters }],
    refetchOnWindowFocus: false,
    queryFn: () => getUsers({ page, limit, filters }),
  });
}
