import { Column, PaymentMethod } from "@/interfaces/common";
import { OrderResponse } from "@/interfaces/order";
import { getPaymentMethodLabel } from "@/utils/payment";
import { getStatusLabel, OrderStatus } from "@/utils/status";
import { format } from "date-fns";

export const columns: readonly Column<OrderResponse>[] = [
  { key: "id", header: "ID" },
  { key: "client", header: "Cliente", render: (client: any) => client.name },
  {
    key: "status",
    header: "Status",
    render: (value: OrderStatus) => getStatusLabel(value),
  },
  {
    key: "paymentMethod",
    header: "Pagamento",
    render: (value: PaymentMethod) => getPaymentMethodLabel(value),
  },
  {
    key: "createdAt",
    header: "Criado em",
    render: (value: string) => format(new Date(value), "dd/MM/yyyy HH:mm"),
  },
];

export const ordersMock = [
  {
    id: 7,
    clientId: 3,
    paymentMethod: "CREDIT" as PaymentMethod,
    status: "PENDING" as OrderStatus,
    createdById: 3,
    createdAt: "2025-11-19T23:26:01.256Z",
    updatedAt: "2025-11-19T23:26:01.256Z",
    client: {
      name: "Manu",
      email: "manu@email.com",
      phone: "+55 11 91234-5678",
      address: {
        street: "Rua das Flores",
        number: "123",
        district: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01000-000",
      },
    },
    OrderItem: [
      { name: "X-Burger", quantity: 2, price: 20 },
      { name: "Coca-Cola 350ml", quantity: 3, price: 5.5 },
    ],
  },
  {
    id: 5,
    clientId: 1,
    paymentMethod: "CASH" as PaymentMethod,
    status: "PENDING" as OrderStatus,
    createdById: 1,
    createdAt: "2025-11-19T22:56:05.002Z",
    updatedAt: "2025-11-19T22:56:05.002Z",
    client: {
      name: "Mara",
      email: "mara@email.com",
      phone: "12312312311",
      address: {
        street: "Rua das Magnólias",
        number: "123",
        district: "",
        city: "Uberlandia",
        state: "Minas Gerais",
        zipCode: "38114512",
      },
    },
    OrderItem: [],
  },
];

export const pagedOrdersMock = {
  data: ordersMock,
  meta: {
    page: 1,
    limit: 10,
    total: ordersMock.length,
    lastPage: 1,
  },
};

export interface OrdersFilterState {
  searchName: string;
  dateFrom: string;
  dateTo: string;
  status: OrderStatus[];
  paymentMethod: PaymentMethod[];
}
export const initialFilters: OrdersFilterState = {
  searchName: "",
  dateFrom: "",
  dateTo: "",
  status: [],
  paymentMethod: [],
};
