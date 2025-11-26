import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type AccountUsersParams = paths['/v1/users']['get']['parameters'];

type AccountUsersData =
  paths['/v1/users']['get']['responses'][200]['content']['application/json'];

export const useAccountUsers = (
  client: Client,
): UseQueryResult<AccountUsersData, unknown> => {
  return client.useQuery('get', '/v1/users', {});
};
