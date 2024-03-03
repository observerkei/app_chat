import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';
import { getAPIModels } from '@/services/models';

export interface GetModelsRequestProps {
  key: string;
  apiHost: string;
}

const useApiService = () => {
  const fetchService = useFetch();

  // const getModels = useCallback(
  // 	(
  // 		params: GetManagementRoutineInstanceDetailedParams,
  // 		signal?: AbortSignal
  // 	) => {
  // 		return fetchService.get<GetManagementRoutineInstanceDetailed>(
  // 			`/v1/ManagementRoutines/${params.managementRoutineId}/instances/${params.instanceId
  // 			}?sensorGroupIds=${params.sensorGroupId ?? ''}`,
  // 			{
  // 				signal,
  // 			}
  // 		);
  // 	},
  // 	[fetchService]
  // );

  const getModels = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
      const ModelsResponse = getAPIModels(params.key, params.apiHost).then();
      return ModelsResponse;
    },
    [fetchService],
  );

  return {
    getModels,
  };
};

export default useApiService;
