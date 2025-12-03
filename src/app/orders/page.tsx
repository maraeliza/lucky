"use client";

import {
  VStack,
  Heading,
  HStack,
  Button,
  useDisclosure,
  SimpleGrid,
  Select,
  Input,
  Box,
  Spinner,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { ProtectedRoute } from "@/context/ProtectedRoute";
import OrderCard from "@/components/my-ui/OrderCard";
import { columns, initialFilters, OrdersFilterState } from "./data";
import { getStatusLabel, OrderStatus } from "@/utils/status";
import { PaymentMethod, getPaymentMethodLabel } from "@/utils/payment";
import { OrderResponse } from "@/interfaces/order";
import { useOrders } from "@/hooks/orders/usePagered";
import { TableWithPagination } from "@/components/my-ui/Table";
import { useDeleteOrder } from "@/hooks/orders/useDelete";
import { FaTable } from "react-icons/fa";
import { FaTableCells } from "react-icons/fa6";
import { ViewOrderModal } from "@/components/my-ui/ModalViewOrder";
import { ConfirmModal } from "@/components/my-ui/ConfirmModal";
import { useEditOrder } from "@/hooks/orders/useEdit";
import { MultiSelectFilter } from "@/components/my-ui/MultipleSelect";
import { Pagination } from "@/components/my-ui/PaginationFooter";
import { useAuth } from "@/context/AuthProvider";
import { useMyOrders } from "@/hooks/orders/useMyOrders";

export default function OrdersDashboard() {
  const [filters, setFilters] = useState<OrdersFilterState>(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 300);
  const [pageSize, setPageSize] = useState(10);
  const [viewTable, setViewTable] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrderResponse | null>(
    null
  );
  const useEditMutation = useEditOrder();
  const useDeleteMutation = useDeleteOrder();
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const isClient = user?.role === "CLIENT";

  const ordersQuery = isClient
    ? useMyOrders({
        page,
        limit: pageSize,
        userId: user?.id ?? 0,
        searchName: debouncedFilters.searchName,
        status: debouncedFilters.status,
        paymentMethod: debouncedFilters.paymentMethod,
        dateFrom: debouncedFilters.dateFrom,
        dateTo: debouncedFilters.dateTo,
      })
    : useOrders({
        page,
        limit: pageSize,
        searchName: debouncedFilters.searchName,
        status: debouncedFilters.status,
        paymentMethod: debouncedFilters.paymentMethod,
        dateFrom: debouncedFilters.dateFrom,
        dateTo: debouncedFilters.dateTo,
      });

  const { data, isLoading, isError } = ordersQuery;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, searchName: value }));
  };

  const handleDateChange = (field: "from" | "to", value: string) => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: field === "from" ? value : prev.dateFrom,
      dateTo: field === "to" ? value : prev.dateTo,
    }));
  };

  const clearFilters = () => setFilters(initialFilters);

  const openModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    onOpen();
  };

  function handleDeleteClick(order: OrderResponse) {
    setOrderToDelete(order);
    setIsDeleteOpen(true);
  }
  const deleteItem = () => {
    if (orderToDelete) {
      useDeleteMutation.mutateAsync(orderToDelete.id);
      setIsDeleteOpen(false);
    }
  };

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    useEditMutation.mutateAsync({ id: orderId, status: newStatus });
  };

  return (
    <ProtectedRoute roles={["ADMIN", "CLIENT"]}>
      <Box px={10}>
        <VStack spacing={6} p={6} align="stretch" bg="gray.50" minH="100vh">
          <HStack justify="space-between">
            <Heading>Pedidos</Heading>
            <HStack>
              <IconButton
                aria-label={viewTable ? "Modo Tabela" : "Modo Card"}
                icon={viewTable ? <FaTable /> : <FaTableCells />}
                onClick={() => setViewTable(!viewTable)}
                colorScheme={viewTable ? "teal" : "blue"}
              />
            </HStack>
          </HStack>
          {/* Filtros */}
          <Box bg="white" p={4} borderRadius="md" shadow="md">
            <HStack spacing={3} wrap="wrap">
              <Input
                placeholder="Pesquisar por nome do cliente"
                value={filters.searchName}
                onChange={(e) => handleSearchChange(e.target.value)}
                maxW="250px"
              />
              <Input
                type="date"
                placeholder="De"
                value={filters.dateFrom}
                onChange={(e) => handleDateChange("from", e.target.value)}
                maxW="150px"
              />
              <Input
                type="date"
                placeholder="Até"
                value={filters.dateTo}
                onChange={(e) => handleDateChange("to", e.target.value)}
                maxW="150px"
              />
              <MultiSelectFilter
                options={Object.values(OrderStatus)}
                selectedOptions={filters.status}
                onChange={(selected) =>
                  setFilters((prev) => ({ ...prev, status: selected }))
                }
                placeholder="Status"
                getLabel={(s) => getStatusLabel(s)}
              />

              <MultiSelectFilter
                options={Object.values(PaymentMethod)}
                selectedOptions={filters.paymentMethod}
                onChange={(selected) =>
                  setFilters((prev) => ({ ...prev, paymentMethod: selected }))
                }
                placeholder="Forma de pagamento"
                getLabel={(pm) => getPaymentMethodLabel(pm)}
              />

              <Button colorScheme="gray" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </HStack>
          </Box>

          {/* Conteúdo principal */}
          {isLoading ? (
            <Spinner size="lg" alignSelf="center" mt={10} />
          ) : (
            data &&
            data.data?.length > 0 &&
            (viewTable ? (
              <TableWithPagination<OrderResponse>
                data={data?.data ?? []}
                columns={columns}
                onDelete={handleDeleteClick}
                onView={openModal}
                pagination={{
                  currentPage: data?.meta.currentPage ?? 1,
                  lastPage: data?.meta.lastPage ?? 1,
                  total: data?.meta.totalCountofRegisters ?? 0,
                  pageSize,
                  onPageChange: setPage,
                  onPageSizeChange: setPageSize,
                }}
              />
            ) : (
              <Stack>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {data?.data.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      openModal={openModal}
                      handleDelete={handleDeleteClick}
                    />
                  ))}
                </SimpleGrid>
                {!viewTable && (
                  <Pagination
                    currentPage={data?.meta.currentPage ?? 1}
                    lastPage={data?.meta.lastPage ?? 1}
                    total={data?.meta.totalCountofRegisters ?? 0}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                  />
                )}
              </Stack>
            ))
          )}
          {data && data.data?.length === 0 && !isLoading && (
            <Box textAlign="center" mt={10}>
              Nenhum pedido encontrado.
            </Box>
          )}
          {selectedOrder && (
            <ViewOrderModal
              onClose={onClose}
              isOpen={isOpen}
              selectedOrder={selectedOrder}
              handleStatusChange={handleStatusChange}
              handleDelete={deleteItem}
              setSelectedOrder={setSelectedOrder}
            />
          )}
          <ConfirmModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={deleteItem}
            title="Excluir Pedido"
            description={`Tem certeza que deseja excluir o pedido #${orderToDelete?.id}?`}
            isPending={useDeleteMutation.isPending}
          />
        </VStack>
      </Box>
    </ProtectedRoute>
  );
}
