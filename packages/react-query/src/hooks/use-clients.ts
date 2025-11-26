import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type ClientsParams = paths['/v1/clients']['get']['parameters'];

type ClientsData =
  paths['/v1/clients']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useClients = (
  queryParams?: ClientsParams['query'],
  options?: Options,
): UseQueryResult<ClientsData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/clients', {
    params: {
      query: queryParams,
    },
  });
};
