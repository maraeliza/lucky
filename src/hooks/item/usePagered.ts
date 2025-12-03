"use client";

import { Item, GetItemResponse } from "@/interfaces/item";
import { PaginationData } from "@/interfaces/common";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Props {
  page: number;
  limit: number;
  filters: {
    categoryId?: number;
    description?: string;
  }
}

async function getItems({
  page,
  limit,
  filters
}: Props): Promise<GetItemResponse> {
  try {
    const response = await api
      .get("/items", { params: { page, limit, ...filters } })
      .then((res) => res.data);

    const data: Item[] = response.data;

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

export function useItems({ page, limit, filters }: Props) {
  return useQuery({
    queryKey: ["items", { page, limit, filters }],
    refetchOnWindowFocus: false,
    queryFn: () => getItems({ page, limit, filters }),
  });
}
