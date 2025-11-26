"use client";

import { queryClient } from "@/context/ChakraProvider";
import { api } from "@/lib/axios";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserFormData } from "@/components/my-ui/CreateUserModal";

export function useAddUser() {
  const toast = useToast();

  return useMutation({
    mutationFn: async (item: UserFormData) => {
      const url = "/auth/register";
      const { confirmPassword, ...userData } = item;
      return await api.post(url, userData);
    },
    onSuccess: () => {
      toast({
        title: "Usuário adicionado com sucesso!",
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
        title: "Não foi possível adicionar o usuário!",
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
