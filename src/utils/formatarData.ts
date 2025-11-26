import { format } from "date-fns";

export const formatValue = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(value);
};

export const parseCurrency = (currencyString: string): number => {
  return parseFloat(
    currencyString.replace("R$", "").replace(".", "").replace(",", ".").trim(),
  );
};

export const formatData = (data: string) => {
  return format(data, "dd/MM/yyyy HH:mm");
};

export function convertToFloat(value: string): number {
  if (!value) return 0;
  const cleanedValue = value.replace("R$", "").trim();
  const normalizedValue = cleanedValue.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalizedValue) || 0;
}
export const formatDateWithMicroseconds = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  const microseconds = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
};
