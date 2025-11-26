import {  UserAdd, UserResponse } from "@/interfaces/user";
import { Column, Field } from "@/interfaces/common";
import { Text } from "@chakra-ui/react";
import { format } from "date-fns";

export const columns: readonly Column<UserResponse>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Nome" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Telefone" },
  {
    key: "address",
    header: "Endereço",
    render: (_value, item) =>
      item.address ? (
        <Text>
          {item.address.street}, {item.address.number} - {item.address.district}
          , {item.address.city}/{item.address.state} - {item.address.zipCode}
        </Text>
      ) : (
        <Text>Não informado</Text>
      ),
  },
  {
    key: "createdAt",
    header: "Criado em",
    render: (value: string) => format(new Date(value), "dd/MM/yyyy HH:mm"),
  },
  {
    key: "updatedAt",
    header: "Modificado em",
    render: (value: string) => format(new Date(value), "dd/MM/yyyy HH:mm"),
  },
];

export const fields: Field<UserAdd>[] = [
  { key: "name", label: "Nome", placeholder: "Digite o nome do usuário" },
  {
    key: "email",
    label: "Email",
    placeholder: "Digite o email do usuário",
    type: "email",
  },
  { key: "phone", label: "Telefone", placeholder: "Digite o telefone" },
  { key: "address.street", label: "Rua", placeholder: "Digite a rua" },
  { key: "address.number", label: "Número", placeholder: "Digite o número" },
  { key: "address.district", label: "Bairro", placeholder: "Digite o bairro" },
  { key: "address.city", label: "Cidade", placeholder: "Digite a cidade" },
  { key: "address.state", label: "Estado", placeholder: "Digite o estado" },
  { key: "address.zipCode", label: "CEP", placeholder: "Digite o CEP" },
];
