"use client";

import { queryClient } from "@/context/ChakraProvider";
import { CategoryEdit } from "@/interfaces/category";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useEditCategory() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (category: CategoryEdit) => {
      const url = "/categories/" + category.id;
      return await api.put(url, category);
    },
    onSuccess: () => {
      toast({
        title: "Edição feita com sucesso!",
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
        title: "Não foi possível salvar as alterações!",
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
