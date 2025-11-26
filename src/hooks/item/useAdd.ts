"use client";

import { queryClient } from "@/context/ChakraProvider";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ItemAdd } from "@/interfaces/item";

export function useAddItem() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (item: ItemAdd) => {
      const url = "/items/";
      return await api.post(url, item);
    },
    onSuccess: () => {
      toast({
        title: "Item adicionado com sucesso!",
        status: "success",
        duration: 2500,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Não foi possível adicionar o item!",
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
