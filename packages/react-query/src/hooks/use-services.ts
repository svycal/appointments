import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ServicesParams = paths['/v1/services']['get']['parameters'];

type ServicesData =
  paths['/v1/services']['get']['responses'][200]['content']['application/json'];

export const useServices = (
  client: Client,
  params?: ServicesParams['query'],
): UseQueryResult<ServicesData, unknown> => {
  return client.useQuery('get', '/v1/services', {
    params: {
      query: params,
    },
  });
};
