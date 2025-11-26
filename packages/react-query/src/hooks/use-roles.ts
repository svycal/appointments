import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type RolesParams =
  paths['/v1/roles']['get']['parameters'];

export const useRoles = (
  client: Client,
  options?: any,
) => {
  return client.useQuery('get', '/v1/roles', {
  }, options);
};
