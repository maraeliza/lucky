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
import { useCategories } from "@/hooks/category/usePageredCategory";
import { TableWithPagination } from "@/components/my-ui/Table";
import { EditModal } from "@/components/my-ui/EditModal";
import { useEditCategory } from "@/hooks/category/useEditCategory";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";
import { ConfirmModal } from "@/components/my-ui/ConfirmModal";
import { useAddCategory } from "@/hooks/category/useAddCategory";
import { CreateModal } from "@/components/my-ui/AddModal";
import { FormCategory, schemaCategory } from "@/utils/schema";
import { useDebounce } from "use-debounce";
import { columns, fields } from "./metaData";
import { Category } from "@/interfaces/category";
import { ProtectedRoute } from "@/context/ProtectedRoute";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [debouncedFilter] = useDebounce(filter, 500);

  const { data, isLoading, isError } = useCategories({
    page,
    limit: pageSize,
    description: debouncedFilter,
  });
  const useAddMutation = useAddCategory();
  const useEditMutation = useEditCategory();
  const useDeleteMutation = useDeleteCategory();

  function handleEdit(item: Category) {
    setSelectedItem(item);
    setIsEditOpen(true);
  }
  function handleDeleteClick(item: Category) {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  }

  function handleSaveEdit(updated: Category) {
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
        <Text color="red.500">Erro ao carregar categorias</Text>
      </Center>
    );

  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <Center py={10}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Categorias</Heading>
            <Button colorScheme="teal" onClick={() => setIsCreateOpen(true)}>
              Nova Categoria
            </Button>
          </HStack>
          <Box maxW="400px">
            <Input
              placeholder="Filtrar por descrição..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="md"
              bg="white"
              _dark={{ bg: "gray.700" }}
              focusBorderColor="teal.400"
            />
          </Box>
          <TableWithPagination
            data={data?.categories ?? []}
            columns={columns}
            onEdit={(item) => handleEdit(item)}
            onDelete={(item) => handleDeleteClick(item)}
            pagination={{
              currentPage: data?.pageData.currentPage ?? 1,
              lastPage: data?.pageData.lastPage ?? 1,
              total: data?.pageData.totalCountofRegisters ?? 0,
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
            title="Excluir Categoria"
            description={`Tem certeza que deseja excluir "${itemToDelete?.description}"?`}
            isPending={useDeleteMutation.isPending}
          />

          <EditModal<Category>
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialData={selectedItem}
            fields={fields}
            title="Editar Categoria"
            onSubmit={handleSaveEdit}
            isPending={useEditMutation.isPending}
          />

          <CreateModal<FormCategory>
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={(data) => useAddMutation.mutateAsync(data)}
            schema={schemaCategory}
            fields={fields}
            title="Cadastrar Categoria"
            isPending={useAddMutation.isPending}
          />
        </VStack>
      </Center>
    </ProtectedRoute>
  );
}
