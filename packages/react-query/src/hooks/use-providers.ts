import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ProvidersParams = paths['/v1/providers']['get']['parameters'];

type ProvidersData =
  paths['/v1/providers']['get']['responses'][200]['content']['application/json'];

export const useProviders = (
  client: Client,
  params?: ProvidersParams['query'],
): UseQueryResult<ProvidersData, unknown> => {
  return client.useQuery('get', '/v1/providers', {
    params: {
      query: params,
    },
  });
};
