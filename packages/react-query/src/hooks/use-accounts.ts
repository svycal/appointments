import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type AccountsParams = paths['/v1/accounts']['get']['parameters'];

type AccountsData =
  paths['/v1/accounts']['get']['responses'][200]['content']['application/json'];

export const useAccounts = (
  client: Client,
  params?: AccountsParams['query'],
): UseQueryResult<AccountsData, unknown> => {
  return client.useQuery('get', '/v1/accounts', {
    params: {
      query: params,
    },
  });
};
