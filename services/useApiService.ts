import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';
import { getAPIModels } from '@/services/models';

export interface GetModelsRequestProps {
  key: string;
  apiHost: string;
}

const useApiService = () => {
  const fetchService = useFetch();

  const getModels = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
      const ModelsResponse = getAPIModels(params.key, params.apiHost)

      return ModelsResponse;
    },
    [fetchService],
  );

  return {
    getModels,
  };
};

export default useApiService;
