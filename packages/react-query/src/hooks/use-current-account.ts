import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type CurrentAccountParams = paths['/v1/account']['get']['parameters'];

type CurrentAccountData =
  paths['/v1/account']['get']['responses'][200]['content']['application/json'];

export const useCurrentAccount = (
  client: Client,
): UseQueryResult<CurrentAccountData, unknown> => {
  return client.useQuery('get', '/v1/account', {});
};
