'use client'  
import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';

import { getAPIModels } from './models';

export interface GetModelsRequestProps {
  key: string;
  apiHost: string;
}

const useApiService = () => {
  const fetchService = useFetch();

  const getModels = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
      
      console.log('home page try get model... key: ', params.key, ' apiHost: ', params.apiHost);

      const ModelsResponse = getAPIModels(params.key, params.apiHost).then();

      console.log('get api models: ', ModelsResponse);

      return ModelsResponse;
      fetchService.post<GetModelsRequestProps>(`/api/models`, {
        body: { 
          key: params.key,
          apiHost: params.apiHost,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });
    },
    [fetchService],
  );

  return {
    getModels,
  };
};

export default useApiService;
