import useSWR from "swr";
import { fetcher } from "../../common/axios/fetcher.swr";

const useHealthCheck = () => {
  const { data, error } = useSWR<{
    status: string;
    timeStamp: Date;
    version: string;
  }>(`/Health/Check`, fetcher, {
    errorRetryCount: 3,
  });

  return {
    data,
    isLoading: !error && !data,
    error,
  };
};

export default useHealthCheck;
