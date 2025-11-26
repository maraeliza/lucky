"use client";

import { Category, GetCategoryResponse } from "@/interfaces/category";
import { PaginationData } from "@/interfaces/common";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Props {
  page: number;
  limit: number;
  description?: string;
}

async function getCategories({
  page,
  limit,
  description,
}: Props): Promise<GetCategoryResponse> {
  try {
    const response = await api
      .get("/categories", { params: { page, limit, description } })
      .then((res) => res.data);

    const categories: Category[] = response.data;

    const pageData: PaginationData = {
      currentPage: response.meta.page,
      registerPerPage: response.meta.limit,
      totalCountofRegisters: response.meta.total,
      lastPage: response.meta.lastPage,
    };
    return { categories, pageData };
  } catch (error) {
    console.error("Erro buscando categorias:", error);

    return {
      categories: [],
      pageData: {
        currentPage: 0,
        registerPerPage: 0,
        totalCountofRegisters: 0,
        lastPage: 0,
      },
    };
  }
}

export function useCategories({ page, limit, description }: Props) {
  return useQuery({
    queryKey: ["categories", { page, limit, description }],
    refetchOnWindowFocus: false,
    queryFn: () => getCategories({ page, limit, description }),
  });
}
