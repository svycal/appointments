import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ProvidersParams = paths['/v1/providers']['get']['parameters'];

export const useProviders = (
  client: Client,
  params?: ProvidersParams['query'],
) => {
  return client.useQuery('get', '/v1/providers', {
    params: {
      query: params,
    },
  });
};
