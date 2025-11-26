"use client";

import { useState } from "react";
import {
  Spinner,
  Center,
  Text,
  Button,
  HStack,
  Input,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import { useItems } from "@/hooks/item/usePagered";
import { useAddItem } from "@/hooks/item/useAdd";
import { useEditItem } from "@/hooks/item/useEdit";
import { useDeleteItem } from "@/hooks/item/useDelete";
import { Item } from "@/interfaces/item";
import { TableWithPagination } from "@/components/my-ui/Table";
import { ConfirmModal } from "@/components/my-ui/ConfirmModal";
import { EditModal } from "@/components/my-ui/EditModal";
import { CreateModal } from "@/components/my-ui/AddModal";
import { FormItem, schemaItem } from "@/utils/schema";
import { columns, fields } from "./metaData";
import { useAllCategories } from "@/hooks/category/useAll";
import { Category } from "@/interfaces/category";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import { Option } from "@/interfaces/common";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [debouncedFilter] = useDebounce(filter, 500);

  const { data, isLoading, isError } = useItems({
    page,
    limit: pageSize,
    description: debouncedFilter,
    categoryId: selectedCategoryId,
  });

  const { data: categories } = useAllCategories();
  const useAddMutation = useAddItem();
  const useEditMutation = useEditItem();
  const useDeleteMutation = useDeleteItem();

  function handleEdit(item: Item) {
    setSelectedItem(item);
    setIsEditOpen(true);
  }
  function handleDeleteClick(item: Item) {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  }

  function handleSaveEdit(updated: Item) {
    useEditMutation.mutateAsync(updated);
  }
  if (isLoading)
    return (
      <Center mt={10}>
        <Spinner size="lg" />
      </Center>
    );
  if (isError)
    return (
      <Center mt={10}>
        <Text color="red.500">Erro ao carregar itens</Text>
      </Center>
    );

  const categoryOptions: Option[] =
    categories?.map((c: Category) => ({
      name: c.description,
      id: c.id.toString(),
    })) || [];

  const itemFields = fields.map((field) =>
    field.key === "categoryId" ? { ...field, options: categoryOptions } : field
  );
  console.log(itemFields);
  console.log(categoryOptions);

  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <Center py={10} px={10}>
        <VStack spacing={6} align="stretch" w="full" maxW="1200px">
          <HStack justify="space-between">
            <Heading size="lg">Itens</Heading>
            <Button colorScheme="teal" onClick={() => setIsCreateOpen(true)}>
              Novo Item
            </Button>
          </HStack>

          <HStack spacing={4} align="stretch">
            <Input
              placeholder="Filtrar por descrição..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="md"
              bg="white"
              _dark={{ bg: "gray.700" }}
              focusBorderColor="teal.400"
              maxW="400px"
            />
          </HStack>

          <TableWithPagination
            data={data?.data ?? []}
            columns={columns}
            onEdit={(item) => handleEdit(item as Item)}
            onDelete={(item) => handleDeleteClick(item as Item)}
            pagination={{
              currentPage: data?.meta.currentPage ?? 1,
              lastPage: data?.meta.lastPage ?? 1,
              total: data?.meta.totalCountofRegisters ?? 0,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
          <ConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => {
              if (itemToDelete) {
                useDeleteMutation.mutateAsync(itemToDelete.id);
                setIsDeleteOpen(false);
              }
            }}
            title="Excluir Item"
            description={`Tem certeza que deseja excluir o item "${itemToDelete?.description}"?`}
            isPending={useDeleteMutation.isPending}
          />

          <EditModal<Item>
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialData={selectedItem}
            fields={itemFields}
            title="Editar Item"
            onSubmit={handleSaveEdit}
            isPending={useEditMutation.isPending}
          />

          <CreateModal<FormItem>
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={(data) => useAddMutation.mutateAsync(data)}
            schema={schemaItem}
            fields={itemFields}
            title="Cadastrar Item"
            isPending={useAddMutation.isPending}
          />
        </VStack>
      </Center>
    </ProtectedRoute>
  );
}
