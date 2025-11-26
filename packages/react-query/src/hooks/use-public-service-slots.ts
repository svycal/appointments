import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type PublicServiceSlotsParams =
  paths['/v1/public/services/{service_id}/slots']['get']['parameters'];

export const usePublicServiceSlots = (
  client: Client,
  service_id: PublicServiceSlotsParams['path']['service_id'],
  params: PublicServiceSlotsParams['query'],
) => {
  return client.useQuery('get', '/v1/public/services/{service_id}/slots', {
    params: {
      path: { service_id },
      query: params,
    },
  });
};
