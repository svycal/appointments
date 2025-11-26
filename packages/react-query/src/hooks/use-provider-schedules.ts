import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ProviderSchedulesParams =
  paths['/v1/provider_schedules']['get']['parameters'];

type ProviderSchedulesData =
  paths['/v1/provider_schedules']['get']['responses'][200]['content']['application/json'];

export const useProviderSchedules = (
  client: Client,
  params?: ProviderSchedulesParams['query'],
): UseQueryResult<ProviderSchedulesData, unknown> => {
  return client.useQuery('get', '/v1/provider_schedules', {
    params: {
      query: params,
    },
  });
};
