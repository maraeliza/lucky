import { OrderResponse } from "@/interfaces/order";

export  const downloadOrder = (order: OrderResponse) => {
    const blob = new Blob([JSON.stringify(order, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pedido_${order.id}.json`;
    link.click();
  };
