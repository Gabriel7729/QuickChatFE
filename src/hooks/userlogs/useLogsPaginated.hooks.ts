import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../common/axios/fetcher.swr";
import { ResponsePaginatedModel } from "../../models/base.model";
import { LogResponseDto } from "../../models/log/log.model";
import useSWR from "swr";

const PAGE_SIZE = 10;

const useLogsPaginated = (queryFilter: string, pageNumber: number = 1, pageSize: number = 10) => {
  const { data, mutate, error } = useSWR<ResponsePaginatedModel<LogResponseDto>>(
    `/Log/Paginated?pageNumber=${pageNumber}&pageSize=${pageSize}&${queryFilter}`,
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
}
export const useLogs = (queryFilter: string) => {
  const getKey = (pageIndex: number, previousPageData: ResponsePaginatedModel<LogResponseDto> | null) => {
    if (previousPageData && !previousPageData.value.items.length) return null;
    return `/Log/Paginated?pageNumber=${pageIndex + 1}&pageSize=${PAGE_SIZE}&${queryFilter}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<ResponsePaginatedModel<LogResponseDto>>(
    getKey,
    fetcher,
    {
      errorRetryCount: 3,
    }
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.value.items.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.value.items.length < PAGE_SIZE);

  return {
    data: data?.flatMap(page => page.value.items) ?? [],
    isLoading: isLoadingInitialData,
    isLoadingMore,
    error,
    size,
    setSize,
    isReachingEnd,
    mutate,
  };
};

export default useLogsPaginated;