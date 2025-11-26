import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type AccountByIdParams =
  paths['/v1/accounts/{account_id}']['get']['parameters'];

type AccountByIdData =
  paths['/v1/accounts/{account_id}']['get']['responses'][200]['content']['application/json'];

export const useAccountById = (
  client: Client,
  account_id: AccountByIdParams['path']['account_id'],
): UseQueryResult<AccountByIdData, unknown> => {
  return client.useQuery('get', '/v1/accounts/{account_id}', {
    params: {
      path: { account_id },
    },
  });
};
