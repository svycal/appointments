import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ServiceProvidersParams =
  paths['/v1/services/{service_id}/providers']['get']['parameters'];

export const useServiceProviders = (
  client: Client,
  service_id: ServiceProvidersParams['path']['service_id'],
  options?: any,
) => {
  return client.useQuery('get', '/v1/services/{service_id}/providers', {
    params: {
      path: { service_id },
    },
  }, options);
};
