import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type AccountUsersParams = paths['/v1/users']['get']['parameters'];

export const useAccountUsers = (client: Client) => {
  return client.useQuery('get', '/v1/users', {});
};
