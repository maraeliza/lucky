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

export default function HomeClient() {
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
        {!isMobile && (
          <Image
            src="/imgs/UAI.png"
            alt="UaiFood"
            boxSize="220px"
            objectFit="contain"
          />
        )}

        <Heading
          size={isMobile ? "xl" : "2xl"}
          fontWeight="extrabold"
          color="teal.700"
        >
          Seja Bem-Vindo ao UaiFood!
        </Heading>

        <Text fontSize={isMobile ? "md" : "lg"} color="gray.700">
          Aqui você encontra os melhores itens e pedidos de forma rápida e
          prática. Explore nosso mercado e faça seu pedido agora mesmo!
        </Text>

        <Box>
          <Button size="lg" colorScheme="teal" mr={4} onClick={() => router.push("/market")}>
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
