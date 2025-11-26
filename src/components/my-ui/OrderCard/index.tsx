"use client";

import { Text, Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { InfoIcon, DownloadIcon, DeleteIcon } from "@chakra-ui/icons";
import { OrderBadge } from "@/components/my-ui/BadgeStatus";
import { OrderStatus } from "@/utils/status";
import { downloadOrder } from "@/utils/order";
import { OrderResponse } from "@/interfaces/order";
import { getPaymentMethodLabel } from "@/utils/payment";
import { format } from "date-fns";

type Props = {
  order: OrderResponse;
  openModal: (order: OrderResponse) => void;
  handleDelete: (order: OrderResponse) => void;
};

export default function OrderCard({ order, openModal, handleDelete }: Props) {
  const total =
    order.OrderItem?.length > 0
      ? order.OrderItem?.reduce(
          (acc, orderItem) =>
            acc + orderItem.item.unitPrice * orderItem.quantity,
          0
        )
      : 0;

  return (
    <Box key={order.id} bg="white" p={4} borderRadius="md" shadow="md">
      <HStack justify="space-between" mb={3}>
        <Text fontSize="lg" fontWeight="semibold">
          Pedido #{order.id}
        </Text>
        <OrderBadge status={order.status as OrderStatus} />
      </HStack>

      <VStack align="flex-start" spacing={1}>
        <Text color="gray.700">
          <strong>Cliente:</strong> {order.client.name}
        </Text>

        <Text color="gray.700">
          <strong>Total:</strong> R$ {total.toFixed(2)}
        </Text>

        <Text color="gray.700">
          <strong>Pagamento:</strong>{" "}
          {getPaymentMethodLabel(order.paymentMethod)}
        </Text>

        <Text color="gray.700">
          <strong>Data:</strong>{" "}
          {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
        </Text>
      </VStack>
      <HStack mt={4} spacing={2}>
        <IconButton
          aria-label="Detalhes"
          icon={<InfoIcon />}
          size="sm"
          onClick={() => openModal(order)}
        />
        <IconButton
          aria-label="Baixar pedido"
          icon={<DownloadIcon />}
          size="sm"
          onClick={() => downloadOrder(order)}
        />
        <IconButton
          aria-label="Excluir pedido"
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="gray"
          onClick={() => handleDelete(order)}
        />
      </HStack>
    </Box>
  );
}
