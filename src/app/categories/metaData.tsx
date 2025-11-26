import { Category, CategoryAdd } from "@/interfaces/category";
import { Column, Field } from "@/interfaces/common";
import { Box } from "@chakra-ui/react";
import { format } from "date-fns";

export const columns: readonly Column<Category>[] = [
  {
    key: "color",
    header: "Cor",
    render: (value: string) => (
      <Box
        width="24px"
        height="24px"
        bg={value}
        borderRadius="full"
        border="1px solid #ccc"
      />
    ),
  },
  { key: "id", header: "ID" },
  { key: "description", header: "Descrição" },
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

export const fields: Field<CategoryAdd>[] = [
  {
    key: "description",
    label: "Descrição",
    placeholder: "Digite a categoria",
  },
  {
    key: "color",
    label: "Cor",
    type: "color",
  },
];
