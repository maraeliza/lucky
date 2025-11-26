import { Address } from "./address";
import { PaginationData } from "./common";

export interface UserAdd {
  name: string;
  email: string;
  phone: string;
  address?: Address;
  addressId?: number;
}

export interface UserEdit extends UserAdd {
  id: number;
}

export interface User extends UserEdit {
  createdAt: string;
  updatedAt: string;
}


export type UpdateUserPayload = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: {
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
};
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  address: {
    id: number;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
export interface GetUserResponse {
  data: UserResponse[];
  meta: PaginationData;
}
export interface UsersFilterState {
  query?: string;
}
