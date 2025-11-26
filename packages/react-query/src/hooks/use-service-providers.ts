import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ServiceProvidersParams =
  paths['/v1/services/{service_id}/providers']['get']['parameters'];

type ServiceProvidersData =
  paths['/v1/services/{service_id}/providers']['get']['responses'][200]['content']['application/json'];

export const useServiceProviders = (
  client: Client,
  service_id: ServiceProvidersParams['path']['service_id'],
): UseQueryResult<ServiceProvidersData, unknown> => {
  return client.useQuery('get', '/v1/services/{service_id}/providers', {
    params: {
      path: { service_id },
    },
  });
};
