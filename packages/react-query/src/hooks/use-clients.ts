import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type ClientsParams = paths['/v1/clients']['get']['parameters'];

export const useClients = (client: Client, params?: ClientsParams['query']) => {
  return client.useQuery('get', '/v1/clients', {
    params: {
      query: params,
    },
  });
};
