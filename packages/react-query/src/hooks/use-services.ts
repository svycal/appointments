import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type ServicesParams = paths['/v1/services']['get']['parameters'];

export const useServices = (
  client: Client,
  params?: ServicesParams['query'],
) => {
  return client.useQuery('get', '/v1/services', {
    params: {
      query: params,
    },
  });
};
