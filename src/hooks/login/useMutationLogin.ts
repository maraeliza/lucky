"use client";

import { api } from "@/lib/axios";
import { FormLogin } from "@/utils/schema";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useMutationLogin() {
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: FormLogin) => {
      try {
        const response = await api.post("/auth/login", data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error: AxiosError<{ message: string }, any>) => {
      const axiosError = error as AxiosError<{ message: string }>;

      const message =
        axiosError.response?.data?.message ||
        "Ocorreu um erro inesperado ao autenticar.";

      toast({
        title: "Falha na Autenticação",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
}
