import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type AccountsParams = paths['/v1/accounts']['get']['parameters'];

type AccountsData =
  paths['/v1/accounts']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useAccounts = (
  queryParams?: AccountsParams['query'],
  options?: Options,
): UseQueryResult<AccountsData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/accounts', {
    params: {
      query: queryParams,
    },
  });
};
