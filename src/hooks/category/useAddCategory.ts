"use client";

import { queryClient } from "@/context/ChakraProvider";
import { CategoryAdd } from "@/interfaces/category";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useAddCategory() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (category: CategoryAdd) => {
      const url = "/categories/";
      return await api.post(url, category);
    },
    onSuccess: () => {
      toast({
        title: "Adicionado com sucesso!",
        status: "success",
        duration: 2500,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Não foi possível adicionar a categoria!",
        status: "error",
        description:
          error.response?.data.message || "Ocorreu um erro inesperado.",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    },
  });
}
