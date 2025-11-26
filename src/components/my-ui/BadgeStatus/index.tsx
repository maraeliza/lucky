import { getStatusColor, getStatusLabel, OrderStatus } from "@/utils/status";
import { Badge } from "@chakra-ui/react";

export function OrderBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge colorScheme={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
  );
}
