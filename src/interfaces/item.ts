import { CategoryEdit } from "./category";
import { PaginationData } from "./common";

export interface ItemAdd {
  description: string;
  unitPrice: number;
  categoryId: number;
  image?: string;
}
export interface ItemEdit extends ItemAdd {
  id: number;
}
export interface Item extends ItemEdit {
  category: CategoryEdit;
  createdAt: string;
  updatedAt: string;
}
export interface GetItemResponse {
  data: Item[];
  meta: PaginationData;
}
