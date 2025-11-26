import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type ProviderSchedulesParams =
  paths['/v1/provider_schedules']['get']['parameters'];

type ProviderSchedulesData =
  paths['/v1/provider_schedules']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useProviderSchedules = (
  params?: ProviderSchedulesParams['query'],
  options?: Options,
): UseQueryResult<ProviderSchedulesData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/provider_schedules', {
    params: {
      query: params,
    },
  });
};
