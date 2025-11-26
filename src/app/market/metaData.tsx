// item.config.ts

import { Item, ItemAdd } from "@/interfaces/item";
import { Column, Field } from "@/interfaces/common";
import { Box, HStack, Text } from "@chakra-ui/react";
import { format } from "date-fns";

export const columns: readonly Column<Item>[] = [
  { key: "id", header: "ID" },
  { key: "description", header: "Descrição do Item" },
  { key: "unitPrice", header: "Preço Unitário" },
  {
    key: "category",
    header: "Categoria",
    render: (_value, item) => (
      <HStack>
        <Box
          width="24px"
          height="24px"
          bg={item.category?.color}
          borderRadius="full"
          border="1px solid #ccc"
        />
        <Text>{item.category?.description}</Text>
      </HStack>
    ),
  },
  {
    key: "createdAt",
    header: "Criado em",
    render: (value: string) => format(new Date(value), "dd/MM/yyyy HH:mm"),
  },
];
export const fields: Field<ItemAdd>[] = [
  {
    key: "description",
    label: "Nome do Item",
    placeholder: "Digite o nome ou descrição do item",
  },
  {
    key: "unitPrice",
    label: "Preço Unitário (R$)",
    placeholder: "Ex: 10.50",
    type: "number",
  },
  {
    key: "categoryId",
    label: "Categoria",
    placeholder: "Selecione a categoria",
    type: "select",
  },
  {
    key: "image",
    label: "URL da Imagem",
    placeholder: "Opcional: URL da imagem do item",
    type: "text",
  },
];
