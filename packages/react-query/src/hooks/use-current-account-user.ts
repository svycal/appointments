import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type CurrentAccountUserParams = paths['/v1/user']['get']['parameters'];

export const useCurrentAccountUser = (client: Client) => {
  return client.useQuery('get', '/v1/user', {});
};
