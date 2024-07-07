import { UserRole } from './../../common/enums/user.enum';
import useSWR from "swr";
import { ResponseModel, ResponsePaginatedModel } from "../../models/base.model";
import { fetcher } from "../../common/axios/fetcher.swr";
import { UserResponseDto } from "../../models/user/user.model";

export const useUsersPaginated = (pageNumber: number = 1, pageSize: number = 10) => {
  const { data, mutate, error } = useSWR<ResponsePaginatedModel<UserResponseDto>>(
    `/User/Paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

export const useUsersByBranchPaginated = (
  branchId: string, 
  role?: UserRole, 
  pageNumber: number = 1, 
  pageSize: number = 10
) => {
  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (role !== undefined) {
    queryParams.append('role', role.toString());
  }

  const { data, mutate, error } = useSWR<ResponsePaginatedModel<UserResponseDto>>(
    `/User/Branch/${branchId}?${queryParams.toString()}`,
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

export const useGetUserById = (userId: string) => {
  const { data, mutate, error } = useSWR<ResponseModel<UserResponseDto>>(
    `/User/${userId}`,
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