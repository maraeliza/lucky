import { PaginationData } from "./common";

export interface CategoryAdd {
  description: string;
  color?: string;
}
export interface CategoryEdit extends CategoryAdd {
  id: number;
}
export interface Category extends CategoryEdit {
  createdAt: string;
  updatedAt: string;
}
export interface GetCategoryResponse {
  categories: Category[];
  pageData: PaginationData;
}
