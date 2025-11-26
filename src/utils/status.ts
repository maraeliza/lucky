// enums.ts
export enum OrderStatus {
  PENDING = "PENDING",         // Pendente
  IN_PROGRESS = "IN_PROGRESS", // Em preparo
  COMPLETED = "COMPLETED",     // Concluído
  CANCELLED = "CANCELLED",     // Cancelado
}

// Mapa de cores para badges
export const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "orange",
  [OrderStatus.IN_PROGRESS]: "blue",
  [OrderStatus.COMPLETED]: "green",
  [OrderStatus.CANCELLED]: "red",
};

// Mapa de labels legíveis para frontend
export const statusLabelMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pendente",
  [OrderStatus.IN_PROGRESS]: "Em Preparo",
  [OrderStatus.COMPLETED]: "Concluído",
  [OrderStatus.CANCELLED]: "Cancelado",
};

// Função utilitária para pegar cor do status
export const getStatusColor = (status: OrderStatus | string) => {
  if (status in statusColorMap) {
    return statusColorMap[status as OrderStatus];
  }
  return "gray";
};

// Função utilitária para pegar label legível do status
export const getStatusLabel = (status: OrderStatus | string) => {
  if (status in statusLabelMap) {
    return statusLabelMap[status as OrderStatus];
  }
  return status;
};
