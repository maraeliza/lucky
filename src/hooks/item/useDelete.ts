"use client";

import { queryClient } from "@/context/ChakraProvider";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useDeleteItem() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (itemId: number) => {
      const url = "/items/" + itemId;
      return await api.delete(url);
    },
    onSuccess: () => {
      toast({
        title: "Item deletado com sucesso!",
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
        title: "Não foi possível deletar o item!",
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
