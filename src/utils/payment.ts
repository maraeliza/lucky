export enum PaymentMethod {
  CASH = "CASH",
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
  PIX = "PIX",
}

export const getPaymentMethodLabel = (method: PaymentMethod | string): string => {
  switch (method) {
    case PaymentMethod.CASH:
      return "Dinheiro";
    case PaymentMethod.DEBIT:
      return "Débito";
    case PaymentMethod.CREDIT:
      return "Crédito";
    case PaymentMethod.PIX:
      return "Pix";
    default:
      return "Desconhecido";
  }
};