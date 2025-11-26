"use client";

import { Category } from "@/interfaces/category";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

async function getCategories(): Promise<Category[]> {
  try {
    const categories: Category[] = await api
      .get("/categories/all")
      .then((res) => res.data); // pega o array diretamente
    return categories;
  } catch (error) {
    console.error("Erro buscando categorias:", error);
    return [];
  }
}


export function useAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    refetchOnWindowFocus: false,
    queryFn: () => getCategories(),
  });
}
