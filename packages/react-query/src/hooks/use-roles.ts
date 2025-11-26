import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type RolesParams = paths['/v1/roles']['get']['parameters'];

type RolesData =
  paths['/v1/roles']['get']['responses'][200]['content']['application/json'];

export const useRoles = (
  client: Client,
): UseQueryResult<RolesData, unknown> => {
  return client.useQuery('get', '/v1/roles', {});
};
