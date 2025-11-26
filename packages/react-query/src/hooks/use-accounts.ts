import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type AccountsParams = paths['/v1/accounts']['get']['parameters'];

export const useAccounts = (
  client: Client,
  params?: AccountsParams['query'],
) => {
  return client.useQuery('get', '/v1/accounts', {
    params: {
      query: params,
    },
  });
};
