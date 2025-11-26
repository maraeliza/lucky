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
  Flex,
} from "@chakra-ui/react";
import { TableWithPagination } from "@/components/my-ui/Table";
import { ConfirmModal } from "@/components/my-ui/ConfirmModal";
import { CreateModal } from "@/components/my-ui/AddModal";
import { useDebounce } from "use-debounce";
import { columns, fields } from "./metaData";
import { User, UserResponse, UsersFilterState } from "@/interfaces/user";
import { useUsers } from "@/hooks/user/usePagered";
import { useAddUser } from "@/hooks/user/useAdd";
import { useDeleteUser } from "@/hooks/user/useDelete";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import UserEditModal from "@/components/my-ui/EditUserModal";
import CreateUserModal from "@/components/my-ui/CreateUserModal";

const initialFilters: UsersFilterState = {
  query: "",
};
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<UserResponse | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<UserResponse | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState<UsersFilterState>(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 500);

  const { data, isLoading, isError } = useUsers({
    page,
    limit: pageSize,
    filters: {
      query: debouncedFilters.query || '',
    },
  });

  const deleteMutation = useDeleteUser();

  function handleEdit(item: UserResponse) {
    setSelectedItem(item);
    setIsEditOpen(true);
  }

  function handleDeleteClick(item: UserResponse) {
    setItemToDelete(item);
    setIsDeleteOpen(true);
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
        <Text color="red.500">Erro ao carregar usuários</Text>
      </Center>
    );

  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <Center py={10} px={10}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">Usuários</Heading>
            <Button colorScheme="teal" onClick={() => setIsCreateOpen(true)}>
              Novo Usuário
            </Button>
          </HStack>

          <Flex width="100%" flexWrap="wrap" gap={4}>
            <Input
              placeholder="Filtrar por nome, email ou telefone..."
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              size="md"
              bg="white"
              _dark={{ bg: "gray.700" }}
              focusBorderColor="teal.400"
              flex={{ base: "100%", md: 1 }}
            />
          </Flex>

          <TableWithPagination
            data={data?.data ?? []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
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
                deleteMutation.mutateAsync(itemToDelete.id);
                setIsDeleteOpen(false);
              }
            }}
            title="Excluir Usuário"
            description={`Tem certeza que deseja excluir "${itemToDelete?.name}"?`}
            isPending={deleteMutation.isPending}
          />

          <UserEditModal
            user={selectedItem}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
          />
          <CreateUserModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          />
        </VStack>
      </Center>
    </ProtectedRoute>
  );
}
