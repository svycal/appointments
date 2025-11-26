import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ServiceParams = paths['/v1/services/{service_id}']['get']['parameters'];

export const useService = (
  client: Client,
  service_id: ServiceParams['path']['service_id'],
) => {
  return client.useQuery('get', '/v1/services/{service_id}', {
    params: {
      path: { service_id },
    },
  });
};
