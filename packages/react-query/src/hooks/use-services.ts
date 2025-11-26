import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type ServicesParams = paths['/v1/services']['get']['parameters'];

type ServicesData =
  paths['/v1/services']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useServices = (
  queryParams?: ServicesParams['query'],
  options?: Options,
): UseQueryResult<ServicesData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/services', {
    params: {
      query: queryParams,
    },
  });
};
