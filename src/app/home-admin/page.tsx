"use client";

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";
import ClosableAlert from "@/components/my-ui/Alert";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import { categoryData, kpis, navCards, orders, salesData } from "./data";
import { getStatusColor } from "@/utils/status";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function HomeAdmin() {
  const router = useRouter();
  const cardBg = useColorModeValue("white", "gray.700");
  const cardHover = useColorModeValue("teal.50", "teal.600");

  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <Box p={6} bg={useColorModeValue("gray.50", "gray.800")} minH="100vh">
        <VStack spacing={2} mb={6} textAlign="center">
          <Heading size="2xl" fontWeight="extrabold">
            Bem-vindo ao Uai Food
          </Heading>
          <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.300")}>
            Gerencie seu restaurante de forma prática e eficiente
          </Text>
        </VStack>
        <VStack spacing={4} mb={6}>
          <ClosableAlert
            status="warning"
            title="Pedidos Pendentes!"
            description="Você tem pedidos pendentes aguardando atenção."
            linkText="Ver Pedidos"
            linkHref="/orders"
          />
          <ClosableAlert
            status="info"
            title="Produtos sem estoque"
            description="Alguns produtos estão sem estoque. Atualize-os."
            linkText="Gerenciar Produtos"
            linkHref="/items"
          />
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
          {kpis.map((kpi) => (
            <Box
              key={kpi.title}
              bg={cardBg}
              p={6}
              borderRadius="xl"
              shadow="md"
              _hover={{
                transform: "translateY(-5px)",
                transition: "0.3s",
                cursor: "default",
              }}
            >
              <HStack spacing={4}>
                <Icon as={kpi.icon} w={10} h={10} color={`${kpi.color}.500`} />
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="sm"
                    color={useColorModeValue("gray.500", "gray.400")}
                  >
                    {kpi.title}
                  </Text>
                  <Heading size="lg">{kpi.value}</Heading>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
          {navCards.map((card) => (
            <Box
              key={card.title}
              bg={cardBg}
              borderRadius="xl"
              p={6}
              shadow="md"
              _hover={{
                bg: cardHover,
                cursor: "pointer",
                transform: "translateY(-5px)",
                transition: "0.3s",
              }}
              onClick={() => router.push(card.route)}
            >
              <HStack spacing={4} mb={4}>
                <Icon
                  as={card.icon}
                  w={10}
                  h={10}
                  color={`${card.color}.500`}
                />
                <Heading size="md">{card.title}</Heading>
              </HStack>
              <Button
                colorScheme={card.color}
                variant="outline"
                size="sm"
                onClick={() => router.push(card.route)}
              >
                Acessar
              </Button>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Heading size="md" mb={4}>
              Vendas da Semana
            </Heading>
            <Line data={salesData} />
          </Box>

          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Heading size="md" mb={4}>
              Produtos por Categoria
            </Heading>
            <Bar data={categoryData} />
          </Box>
        </SimpleGrid>

        <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
          <Heading size="md" mb={4}>
            Pedidos Recentes
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>Status</Th>
                <Th>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.customer}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td>{order.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
