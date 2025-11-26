"use client";

import { queryClient } from "@/context/ChakraProvider";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useDeleteUser() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (itemId: number) => {
      const url = "/users/" + itemId;
      return await api.delete(url);
    },
    onSuccess: () => {
      toast({
        title: "Usuário deletado com sucesso!",
        status: "success",
        duration: 2500,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Não foi possível deletar o usuário!",
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
