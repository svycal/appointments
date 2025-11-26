import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ProviderSchedulesParams =
  paths['/v1/provider_schedules']['get']['parameters'];

export const useProviderSchedules = (
  client: Client,
  params?: ProviderSchedulesParams['query'],
  options?: any,
) => {
  return client.useQuery(
    'get',
    '/v1/provider_schedules',
    {
      params: {
        query: params,
      },
    },
    options,
  );
};
