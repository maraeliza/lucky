import { ZodSchema } from "zod";

export type ResponseError = { message: string };

export interface ApiResponseError {
  message: string;
  status: number;
  type: string;
  errors?: {
    [key: string]: string;
  };
}
export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}
export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
export interface GenericTableProps<T> {
  data: T[];
  columns: readonly Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  pagination?: PaginationProps;
}

export interface PaginationData {
  currentPage: number;
  registerPerPage: number;
  totalCountofRegisters: number;
  lastPage: number;
}
export interface Option {
  id: number
  name: string
}
export interface Field<T> {
  key: keyof T | string;
  label: string;
  placeholder?: string;
  type?: string;
  options?: Option[]
}

export interface CreateModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  schema: ZodSchema<T>;
  fields: Field<T>[];
  title?: string;
  isPending?: boolean;
}
export interface EditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  initialData: T | null;
  fields: Field<T>[];
  title?: string;
  onSubmit: (updated: T) => void;
  isPending: boolean;
}

export interface DashboardData {
  totalItems: number;
  totalOrders: number;
  totalCategories: number;
  ordersByCategory: { category: string; count: number }[];
  recentOrders: {
    id: number;
    clientName: string;
    totalItems: number;
    status: string;
    createdAt: string;
  }[];
}

export type PaymentMethod = "CASH" | "DEBIT" | "CREDIT" | "PIX";
export interface OrderItem {
  id: number;
  quantity: number;
  item: {
    id: number;
    description: string;
    unitPrice: number;
    category?: {
      description: string;
      color?: string;
    };
  };
}

export interface Order {
  id: number;
  clientId: number;
  status: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "CLIENT" | null;

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextProps {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
  loading: boolean
}

export interface LoginResponse {
  access_token: string;
  user: UserData;
}
