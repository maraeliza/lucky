"use client";

import { OrderResponse } from "@/interfaces/order";
import { PaginationData } from "@/interfaces/common";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface OrdersQueryProps {
  page: number;
  limit: number;
  searchName?: string;
  status?: string[];
  paymentMethod?: string[];
  dateFrom?: string;
  dateTo?: string;
  userId: number;
}

export interface GetOrdersResponse {
  data: OrderResponse[];
  meta: PaginationData;
}

async function getOrders({
  page,
  limit,
  searchName,
  status,
  paymentMethod,
  dateFrom,
  dateTo,
  userId,
}: OrdersQueryProps): Promise<GetOrdersResponse> {
  try {
    const response = await api
      .get("/orders/my?userId=" + userId, {
        params: {
          page,
          limit,
          searchName,
          status,
          paymentMethod,
          dateFrom,
          dateTo,
        },
        paramsSerializer: (params) => {
          const parts: string[] = [];
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) =>
                parts.push(`${key}=${encodeURIComponent(v)}`)
              );
            } else if (value !== undefined) {
              parts.push(`${key}=${encodeURIComponent(value)}`);
            }
          });
          return parts.join("&");
        },
      })
      .then((res) => res.data);

    const data: OrderResponse[] = response.data;

    const meta: PaginationData = {
      currentPage: response.meta.page,
      registerPerPage: response.meta.limit,
      totalCountofRegisters: response.meta.total,
      lastPage: response.meta.lastPage,
    };

    return { data, meta };
  } catch (error) {
    console.error("Erro buscando pedidos:", error);

    return {
      data: [],
      meta: {
        currentPage: 0,
        registerPerPage: 0,
        totalCountofRegisters: 0,
        lastPage: 0,
      },
    };
  }
}

export function useMyOrders(query: OrdersQueryProps) {
  return useQuery({
    queryKey: ["orders", query],
    refetchOnWindowFocus: false,
    queryFn: () => getOrders(query),
  });
}
