import useSWR from "swr";
import { fetcher } from "../../common/axios/fetcher.swr";
import { ResponseModel, ResponsePaginatedModel } from "../../models/base.model";
import { GetByIdInvoicePacaResponseDto, ListInvoicePaginatedResponseDto } from "../../models/invoice/invoice.model";

export const usePacaInvoicePaginated = (
  branchId: string,
  filter: string = "",
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  const { data, mutate, error } = useSWR<ResponsePaginatedModel<ListInvoicePaginatedResponseDto>>(
    `/Invoice/Paca/Branch/${branchId}?${filter}${filter.length > 0 ? "&" : ""}pageNumber=${pageNumber}&pageSize=${pageSize}`,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export const useGetInvoicePacaById = (
  invoiceId: string,
) => {
  const { data, mutate, error } = useSWR<ResponseModel<GetByIdInvoicePacaResponseDto>>(
    `/Invoice/Paca/${invoiceId}`,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export const useGetInvoiceItemById = (
  invoiceId: string,
) => {
  const { data, mutate, error } = useSWR<ResponseModel<GetByIdInvoicePacaResponseDto>>(
    `/Invoice/Item/${invoiceId}`,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

export const useItemInvoicePaginated = (
  branchId: string,
  filter: string = "",
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  const { data, mutate, error } = useSWR<ResponsePaginatedModel<ListInvoicePaginatedResponseDto>>(
    `/Invoice/Item/Branch/${branchId}?${filter}${filter.length > 0 ? "&" : ""}pageNumber=${pageNumber}&pageSize=${pageSize}`,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
};
