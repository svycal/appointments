import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type AccountByIdParams =
  paths['/v1/accounts/{account_id}']['get']['parameters'];

export const useAccountById = (
  client: Client,
  account_id: AccountByIdParams['path']['account_id'],
) => {
  return client.useQuery('get', '/v1/accounts/{account_id}', {
    params: {
      path: { account_id },
    },
  });
};
