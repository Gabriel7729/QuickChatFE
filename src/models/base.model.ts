export type ResponseListModel<T> = {
  errors: string[];
  isSuccess: boolean;
  status: number;
  successMessage: string;
  validationErrors: string[];
  value: T[];
};

export type ResponsePaginatedModel<T> = {
  errors: string[];
  isSuccess: boolean;
  status: number;
  successMessage: string;
  validationErrors: string[];
  value: Paginated<T>;
};

export type Paginated<T> = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: T[];
};

export type ResponseModel<T> = {
  errors: string[];
  isSuccess: boolean;
  status: number;
  successMessage: string;
  validationErrors: string[];
  value: T;
};

export type GeneralResponseModel = {
  isSuccess: boolean;
  message: string;
  warnings: string[];
};

export type DeleteResponse = {
  isDeleted: boolean;
  message: string;
};

export type BaseResponseDto = {
  id: string;
};
