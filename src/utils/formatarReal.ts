export const formataReal = (event: React.ChangeEvent<HTMLInputElement>) => {
  const valorInput = event.target.value;
  const numeros = valorInput.replace(/\D/g, "");

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(numeros) / 100);
};
export const formatReal = (valorInput: string) => {
  // Substitui vírgula por ponto (caso o usuário use vírgula como separador decimal)
  const valorSanitizado = valorInput.replace(",", ".").replace(/[^\d.]/g, "");

  const valor = parseFloat(valorSanitizado);

  if (isNaN(valor)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

export const unformatReal = (value: string) => {
  return parseFloat(
    value.replace("R$", "").replace(/\./g, "").replace(",", "."),
  );
};

export const formatDecimal = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
