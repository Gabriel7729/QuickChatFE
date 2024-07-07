import useSWR from "swr";
import { fetcher } from "../../common/axios/fetcher.swr";
import { ResponseListModel, ResponsePaginatedModel } from "../../models/base.model";
import { CustomerResponseDto } from "../../models/customer/customer.model";

export const useCustomerList = (branchId: string) => {
  const { data, error } = useSWR<ResponseListModel<CustomerResponseDto>>(
    `/Customer/Branch/${branchId}`,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  return {
    data,
    isLoading: !error && !data,
    error,
  };
};

export const useCustomerPaginatedList = (branchId: string, pageNumber: number = 1, pageSize: number = 10) => {
  const { data, error, mutate } = useSWR<ResponsePaginatedModel<CustomerResponseDto>>(
    `/Customer/Branch/${branchId}/Paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  return {
    data,
    mutate,
    isLoading: !error && !data,
    error,
  };
};