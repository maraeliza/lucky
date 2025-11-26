"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Center minH="100vh" bgGradient="linear(to-r, teal.400, green.300)">
      <VStack
        spacing={8}
        p={8}
        maxW="800px"
        textAlign="center"
        bg="whiteAlpha.800"
        rounded="xl"
        shadow="2xl"
      >
        {/* Logo ou imagem */}
        {!isMobile && (
          <Image
            src="/imgs/UAI.png" // substitua pela sua logo
            alt="UaiFood"
            boxSize="220px"
            objectFit="contain"
          />
        )}

        {/* Título */}
        <Heading
          size={isMobile ? "xl" : "2xl"}
          fontWeight="extrabold"
          color="teal.700"
        >
          Seja Bem-Vindo ao UaiFood!
        </Heading>

        {/* Subtítulo */}
        <Text fontSize={isMobile ? "md" : "lg"} color="gray.700">
          Aqui você encontra os melhores itens e pedidos de forma rápida e
          prática. Explore nosso mercado e faça seu pedido agora mesmo!
        </Text>

        {/* Botões de ação */}
        <Box>
          <Button
            size="lg"
            colorScheme="teal"
            mr={4}
            onClick={() => router.push("/market")}
          >
            Ir para o Mercado
          </Button>
          <Button
            size="lg"
            variant="outline"
            colorScheme="teal"
            onClick={() => router.push("/order")}
          >
            Meus Pedidos
          </Button>
        </Box>
      </VStack>
    </Center>
  );
}
