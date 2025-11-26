"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Button,
  RadioGroup,
  Radio,
  Stack,
  Image,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import { useAddOrder } from "@/hooks/orders/useAdd";
import { OrderAdd } from "@/interfaces/order";
import { getPaymentMethodLabel, PaymentMethod } from "@/utils/payment";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const useMutationOrder = useAddOrder();
  const toast = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce(
    (acc, ci) => acc + ci.item.unitPrice * ci.quantity,
    0
  );

  const handleSubmit = async () => {
    if (!user || cart.length === 0 || !paymentMethod) return;

    const data: OrderAdd = {
      clientId: user.id,
      paymentMethod,
      createdById: user.id,
      items: cart.map((ci) => ({
        itemId: ci.item.id,
        quantity: ci.quantity,
      })),
    };

    setIsLoading(true);
    try {
      await useMutationOrder.mutateAsync(data);
      clearCart();
      router.push("/orders?my=true");
    } catch (err) {
      toast({
        title: "Erro ao realizar pedido",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["CLIENT"]}>
      <VStack
        spacing={6}
        align="stretch"
        maxW="800px"
        mx="auto"
        py={10}
        px={10}
      >
        <Heading size="lg">Checkout</Heading>

        <Box borderWidth="1px" borderRadius="md" p={4} bg="white" shadow="md">
          <Heading size="md" mb={4}>
            Seu Carrinho
          </Heading>
          {cart.map((ci) => (
            <HStack key={ci.item.id} justify="space-between" mb={2}>
              <HStack>
                {ci.item.image && ci.item.image.length > 1 ? (
                  <Image
                    src={ci.item.image}
                    alt={ci.item.description}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                ) : (
                  <Center boxSize="70px" bg="gray.200" borderRadius="md">
                    <Text fontSize="sm" textAlign={"center"}>
                      Sem imagem
                    </Text>
                  </Center>
                )}
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{ci.item.description}</Text>
                  <HStack spacing={2}>
                    <Box
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={ci.item.category.color || "gray.300"}
                    />
                    <Badge colorScheme="teal">
                      {ci.item.category.description}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>
              <Text>
                {ci.quantity} x R$ {ci.item.unitPrice.toFixed(2)} = R$
                {(ci.item.unitPrice * ci.quantity).toFixed(2)}
              </Text>
            </HStack>
          ))}

          <Text fontWeight="bold" fontSize="lg" mt={4}>
            Total: R$ {total.toFixed(2)}
          </Text>
        </Box>
        <Box borderWidth="1px" borderRadius="md" p={4} bg="white" shadow="md">
          <Heading size="md" mb={4}>
            Forma de Pagamento
          </Heading>

          <RadioGroup
            value={paymentMethod}
            onChange={(value) => setPaymentMethod(value as PaymentMethod)}
          >
            <Stack direction="column" spacing={3}>
              {Object.values(PaymentMethod).map((method) => (
                <Radio key={method} value={method}>
                  {getPaymentMethodLabel(method)}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </Box>

        <Button
          colorScheme="green"
          size="lg"
          mt={4}
          onClick={handleSubmit}
          isLoading={isLoading}
          isDisabled={cart.length === 0}
        >
          Finalizar Pedido
        </Button>
      </VStack>
    </ProtectedRoute>
  );
}
