import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ClientsParams = paths['/v1/clients']['get']['parameters'];

type ClientsData =
  paths['/v1/clients']['get']['responses'][200]['content']['application/json'];

export const useClients = (
  client: Client,
  params?: ClientsParams['query'],
): UseQueryResult<ClientsData, unknown> => {
  return client.useQuery('get', '/v1/clients', {
    params: {
      query: params,
    },
  });
};
