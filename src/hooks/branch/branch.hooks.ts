import useSWR from "swr";
import { ResponseListModel, ResponseModel, ResponsePaginatedModel } from "../../models/base.model";
import { BranchResponseDto } from "../../models/branch/branch.model";
import { fetcher } from "../../common/axios/fetcher.swr";
import { DashboardDto } from "../../models/branch/dashboard.model";

export const useBranchesFromUser = (userId: string) => {
  const { data, error } = useSWR<ResponseListModel<BranchResponseDto>>(
    `/Branch/User/${userId}`,
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

export const useAllBranches = (pageNumber: number, pageSize: number) => {
  const { data, error } = useSWR<ResponsePaginatedModel<BranchResponseDto>>(
    `/Branch/Paginated?PageNumber=${pageNumber}&PageSize=${pageSize}`,
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

export const useBranchById = (branchId: string) => {
  const { data, error } = useSWR<ResponseModel<BranchResponseDto>>(
    `/Branch/${branchId}`,
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

export const useDashboardBranchData = (branchId: string) => {
  const { data, error } = useSWR<ResponseModel<DashboardDto>>(
    `/Branch/${branchId}/Dashboard/Data`,
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