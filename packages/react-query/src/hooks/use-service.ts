import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ServiceParams =
  paths['/v1/services/{service_id}']['get']['parameters'];

type ServiceData =
  paths['/v1/services/{service_id}']['get']['responses'][200]['content']['application/json'];

export const useService = (
  client: Client,
  service_id: ServiceParams['path']['service_id'],
): UseQueryResult<ServiceData, unknown> => {
  return client.useQuery('get', '/v1/services/{service_id}', {
    params: {
      path: { service_id },
    },
  });
};
