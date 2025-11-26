import {
  FiShoppingCart,
  FiPackage,
  FiTag,
  FiHome,
  FiTrendingUp,
} from "react-icons/fi";

export const kpis = [
  { title: "Pedidos Hoje", value: 24, icon: FiShoppingCart, color: "teal" },
  { title: "Pedidos Pendentes", value: 7, icon: FiPackage, color: "orange" },
  { title: "Produtos", value: 42, icon: FiTag, color: "green" },
  {
    title: "Receita Hoje",
    value: "R$ 1.250",
    icon: FiTrendingUp,
    color: "blue",
  },
];

export const navCards = [
  { title: "Dashboard", route: "/dashboard", color: "teal", icon: FiHome },
  {
    title: "Gerenciar Pedidos",
    route: "/orders",
    color: "blue",
    icon: FiShoppingCart,
  },
  { title: "Categorias", route: "/categories", color: "orange", icon: FiTag },
  { title: "Produtos", route: "/items", color: "green", icon: FiPackage },
];

export const orders = [
  { id: "#1001", customer: "João", status: "Pendente", total: "R$ 45" },
  { id: "#1002", customer: "Maria", status: "Em Preparo", total: "R$ 89" },
  { id: "#1003", customer: "Carlos", status: "Concluído", total: "R$ 32" },
  { id: "#1004", customer: "Ana", status: "Pendente", total: "R$ 120" },
];

export const salesData = {
  labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  datasets: [
    {
      label: "Vendas",
      data: [12, 19, 8, 15, 22, 18, 10],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4,
    },
  ],
};

export const categoryData = {
  labels: ["Lanches", "Bebidas", "Sobremesas", "Promoções"],
  datasets: [
    {
      label: "Produtos vendidos",
      data: [40, 25, 15, 10],
      backgroundColor: ["#38B2AC", "#3182CE", "#DD6B20", "#805AD5"],
    },
  ],
};
