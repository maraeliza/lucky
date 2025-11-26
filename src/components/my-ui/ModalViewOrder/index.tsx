"use client";

import { OrderResponse } from "@/interfaces/order";
import { statusLabels } from "@/utils/data";
import { normalizeCepNumber, normalizePhoneNumber } from "@/utils/formats";
import { downloadOrder } from "@/utils/order";
import { OrderStatus } from "@/utils/status";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Divider,
  Text,
  Box,
  Badge,
  Stack,
  Select,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
interface ViewItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: OrderResponse;
  setSelectedOrder: (order: OrderResponse) => void;
  handleDelete: (order: OrderResponse) => void;
  handleStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

export function ViewOrderModal({
  isOpen,
  onClose,
  selectedOrder,
  setSelectedOrder,
  handleDelete,
  handleStatusChange,
}: ViewItemsModalProps) {
  const [statusToChange, setStatusToChange] = useState<OrderStatus | null>(
    null
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const total =
    selectedOrder.OrderItem?.length > 0
      ? selectedOrder.OrderItem?.reduce(
          (acc, orderItem) => acc + orderItem.item.unitPrice * orderItem.quantity,
          0
        )
      : 0;

  const address = selectedOrder.client.address;
  const formattedAddress = [
    address.street,
    address.number,
    address.district,
    address.city,
    address.state,
    normalizeCepNumber(address.zipCode),
  ]
    .filter(Boolean)
    .join(", ");

  const confirmStatusChange = () => {
    if (statusToChange) {
      handleStatusChange(selectedOrder.id, statusToChange);
      setStatusToChange(null);
      setSelectedOrder({
        ...selectedOrder,
        status: statusToChange,
      });
      setIsAlertOpen(false);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent borderRadius="lg" overflow="hidden">
          <ModalHeader bg="blue.600" color="white">
            Pedido #{selectedOrder.id}
          </ModalHeader>
          <ModalCloseButton color="white" />

          <ModalBody p={6}>
            {/* Cliente */}
            <Box mb={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>
                Cliente
              </Text>
              <VStack align="start" spacing={1}>
                <Text>{selectedOrder.client.name}</Text>
                <Text color="gray.600">{selectedOrder.client.email}</Text>
                <Text color="gray.600">
                  {normalizePhoneNumber(selectedOrder.client.phone)}
                </Text>
              </VStack>
            </Box>

            {/* Endereço */}
            <Box mb={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>
                Endereço
              </Text>
              {formattedAddress ? (
                <Text>{formattedAddress}</Text>
              ) : (
                <Text color="gray.500">Endereço não informado</Text>
              )}
            </Box>

            {/* Itens do pedido */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Itens do Pedido
              </Text>
              <VStack align="stretch" spacing={3}>
                {selectedOrder.OrderItem?.length > 0 ? (
                  selectedOrder.OrderItem.map((orderItem, idx) => (
                    <HStack
                      key={idx}
                      justify="space-between"
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{orderItem.item.description}</Text>
                        <Badge colorScheme="green">{orderItem.quantity}x</Badge>
                      </VStack>
                      <Text fontWeight="bold">
                        R$ {(orderItem.item.unitPrice * orderItem.quantity).toFixed(2)}
                      </Text>
                    </HStack>
                  ))
                ) : (
                  <Text color="gray.500">Nenhum item pedido</Text>
                )}
              </VStack>
              <Divider my={4} />
              <HStack justify="space-between">
                <Text fontWeight="bold">Total:</Text>
                <Text fontWeight="bold" fontSize="lg">
                  R$ {total.toFixed(2)}
                </Text>
              </HStack>
            </Box>
            <Select
              mt={2}
              size="md"
              value={selectedOrder.status}
              onChange={(e) => {
                setStatusToChange(e.target.value as OrderStatus);
                setIsAlertOpen(true);
              }}
              borderColor="blue.400"
              focusBorderColor="blue.600"
              fontWeight="medium"
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status] || status}
                </option>
              ))}
            </Select>

            {/* Botão de download */}
            <Stack direction="row" mt={6}>
              <Button
                colorScheme="purple"
                leftIcon={<FaFilePdf />}
                onClick={() => downloadOrder(selectedOrder)}
              >
                Baixar
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<DeleteIcon />}
                onClick={() => handleDelete(selectedOrder)}
              >
                Excluir
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar alteração
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja alterar o status para{" "}
              <strong>{statusLabels[statusToChange!]}</strong>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={confirmStatusChange} ml={3}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
