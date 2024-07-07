import useSWR from "swr";
import { fetcher } from "../../common/axios/fetcher.swr";
import { ResponseListModel } from "../../models/base.model";
import { PacaResponseDto } from "../../models/paca/paca.model";

export const usePacaList = (branchId: string) => {
  const { data, error } = useSWR<ResponseListModel<PacaResponseDto>>(
    `/Paca/Branch/${branchId}`,
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
