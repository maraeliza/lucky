"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

async function getAddressByCEP(cep: string): Promise<ViaCepResponse> {
  const { data } = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${cep}/json/`
  );
  return data;
}

export function useViaCep(cep: string) {
  return useQuery({
    queryKey: ["my-user", { cep }],
    refetchOnWindowFocus: false,
    queryFn: () => getAddressByCEP(cep),
    enabled: cep.length === 8,
  });
}
