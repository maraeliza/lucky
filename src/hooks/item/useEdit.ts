"use client";

import { queryClient } from "@/context/ChakraProvider";
import { ItemEdit } from "@/interfaces/item";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useEditItem() {
  // 💡 1. Nome do hook ajustado
  const toast = useToast();

  return useMutation({
    mutationFn: async (item: ItemEdit) => {
      const url = "/items/" + item.id;
      return await api.put(url, item);
    },
    onSuccess: () => {
      toast({
        title: "Item editado com sucesso!", // 💡 4. Mensagem ajustada
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
        title: "Não foi possível salvar as alterações do item!", // 💡 6. Mensagem ajustada
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
