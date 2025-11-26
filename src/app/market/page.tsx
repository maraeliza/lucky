"use client";

import { useState } from "react";
import {
  Spinner,
  Center,
  Text,
  HStack,
  Input,
  VStack,
  Heading,
  Box,
  SimpleGrid,
  Image,
  Badge,
  IconButton,
  Flex,
  Button,
} from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useDebounce } from "use-debounce";

import { useItems } from "@/hooks/item/usePagered";
import { useAllCategories } from "@/hooks/category/useAll";
import { Item } from "@/interfaces/item";
import { Category } from "@/interfaces/category";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import { useCart } from "@/context/CartProvider";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const [filter, setFilter] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [debouncedFilter] = useDebounce(filter, 500);
  const { cart, addItem, removeItem, clearCart } = useCart();
  const router = useRouter();
  const {
    data: itemsData,
    isLoading,
    isError,
  } = useItems({
    page: 1,
    limit: 100,
    description: debouncedFilter,
    categoryId: selectedCategoryId,
  });

  const { data: categories } = useAllCategories();
  console.log(itemsData);

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

  return (
    <ProtectedRoute roles={["CLIENT"]}>
      <VStack
        spacing={6}
        align="stretch"
        w="full"
        maxW="1200px"
        mx="auto"
        py={10}
        px={10}
      >
        <Heading size="lg">Faça seu Pedido</Heading>

        {/* Filtros */}
        <HStack spacing={4} flexWrap="wrap">
          <Input
            placeholder="Filtrar por descrição..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="md"
            maxW="400px"
            bg="white"
            _dark={{ bg: "gray.700" }}
          />
        </HStack>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {itemsData?.data.map((item: Item) => {
            const cartItem = cart.find((ci) => ci.item.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                bg="white"
                _dark={{ bg: "gray.700" }}
                shadow="md"
              >
                {/* Imagem */}
                <Box
                  h="150px"
                  mb={4}
                  bg="gray.100"
                  borderRadius="md"
                  overflow="hidden"
                >
                  {item.image && item.image?.length > 1 ? (
                    <Image
                      src={item.image}
                      alt={item.description}
                      objectFit="cover"
                      w="full"
                      h="full"
                    />
                  ) : (
                    <Center w="full" h="full">
                      <Text color="gray.400">Sem imagem</Text>
                    </Center>
                  )}
                </Box>

                <Text fontWeight="bold" mb={2}>
                  {item.description}
                </Text>
                <HStack mb={2} spacing={2}>
                  <Box
                    w="12px"
                    h="12px"
                    borderRadius="full"
                    bg={item.category.color || "gray.300"}
                  />
                  <Badge colorScheme="teal">{item.category.description}</Badge>
                </HStack>

                <Text fontWeight="bold" mb={2}>
                  R$ {item.unitPrice.toFixed(2)}
                </Text>

                <Flex justify="space-between" align="center">
                  <HStack>
                    <IconButton
                      aria-label="Remover"
                      icon={<FaMinus />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeItem(item)}
                      isDisabled={quantity === 0}
                    />
                    <Text>{quantity}</Text>
                    <IconButton
                      aria-label="Adicionar"
                      icon={<FaPlus />}
                      size="sm"
                      colorScheme="green"
                      onClick={() => addItem(item)}
                    />
                  </HStack>
                </Flex>
              </Box>
            );
          })}
        </SimpleGrid>

        {cart.length > 0 && (
          <Box
            mt={6}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="white"
            _dark={{ bg: "gray.700" }}
          >
            <Heading size="md" mb={4}>
              Carrinho
            </Heading>

            {cart.map((ci) => (
              <HStack
                key={ci.item.id}
                justify="space-between"
                mb={2}
                borderBottom="1px solid"
                borderColor="gray.200"
                pb={2}
              >
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

                <HStack spacing={2}>
                  <Text>{ci.quantity} x</Text>
                  <Text>R$ {(ci.item.unitPrice * ci.quantity).toFixed(2)}</Text>
                </HStack>
              </HStack>
            ))}

            <Text fontWeight="bold" mt={4} fontSize="lg">
              Total: R${" "}
              {cart
                .reduce((acc, ci) => acc + ci.item.unitPrice * ci.quantity, 0)
                .toFixed(2)}
            </Text>

            <Button
              mt={4}
              colorScheme="green"
              w="full"
              onClick={() => router.push("/checkout")}
            >
              Finalizar Pedido
            </Button>
          </Box>
        )}
      </VStack>
    </ProtectedRoute>
  );
}
