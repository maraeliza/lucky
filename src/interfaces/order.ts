import { OrderStatus } from "@/utils/status";
import { PaginationData } from "./common";

export interface OrderItemData {
  id: number;
  quantity: number;
  item: {
    id: number;
    description: string;
    unitPrice: number;
    category: { description: string; color?: string };
    image?: string;
  };
}

export type PaymentMethod = "CASH" | "DEBIT" | "CREDIT" | "PIX";
export type Status = "PENDING" | "PAID" | "CANCELLED";

export interface OrderData {
  id: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  orderItems: OrderItemData[];
}
export interface OrderAddItem {
  itemId: number;
  quantity: number;
}

export interface OrderAdd {
  clientId: number;
  paymentMethod: PaymentMethod;
  createdById: number;
  items: OrderAddItem[];
}


export interface OrderEdit  {
  clientId?: number;
  paymentMethod?: PaymentMethod;
  status?: OrderStatus;
  createdById?: number;
  id: number;
}

export interface Address {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Client {
  name: string;
  email: string;
  phone: string;
  address: Address;
}
export interface Item {
  unitPrice: number;
  description: string;
}

export interface OrderItem {
  item: Item;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  client: Client;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  OrderItem: OrderItem[];
}

export interface GetOrderResponse {
  data: OrderResponse[];
  meta: PaginationData;
}