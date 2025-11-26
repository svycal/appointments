import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ServicesParams = paths['/v1/services']['get']['parameters'];

export const useServices = (
  client: Client,
  params?: ServicesParams['query'],
  options?: any,
) => {
  return client.useQuery(
    'get',
    '/v1/services',
    {
      params: {
        query: params,
      },
    },
    options,
  );
};
