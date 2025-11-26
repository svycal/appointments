import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ServiceSlotsParams =
  paths['/v1/services/{service_id}/slots']['get']['parameters'];

export const useServiceSlots = (
  client: Client,
  service_id: ServiceSlotsParams['path']['service_id'],
  params: ServiceSlotsParams['query'],
) => {
  return client.useQuery('get', '/v1/services/{service_id}/slots', {
    params: {
      path: { service_id },
      query: params,
    },
  });
};
