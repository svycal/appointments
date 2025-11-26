import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type CurrentAccountUserParams =
  paths['/v1/user']['get']['parameters'];

export const useCurrentAccountUser = (
  client: Client,
  options?: any,
) => {
  return client.useQuery('get', '/v1/user', {
  }, options);
};
