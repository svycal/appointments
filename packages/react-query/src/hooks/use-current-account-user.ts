import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type CurrentAccountUserParams = paths['/v1/user']['get']['parameters'];

type CurrentAccountUserData =
  paths['/v1/user']['get']['responses'][200]['content']['application/json'];

export const useCurrentAccountUser = (
  client: Client,
): UseQueryResult<CurrentAccountUserData, unknown> => {
  return client.useQuery('get', '/v1/user', {});
};
