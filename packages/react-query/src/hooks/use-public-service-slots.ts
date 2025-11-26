import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type PublicServiceSlotsParams =
  paths['/v1/public/services/{service_id}/slots']['get']['parameters'];

export const usePublicServiceSlots = (
  client: Client,
  service_id: PublicServiceSlotsParams['path']['service_id'],
  params: PublicServiceSlotsParams['query'],
  options?: any,
) => {
  return client.useQuery(
    'get',
    '/v1/public/services/{service_id}/slots',
    {
      params: {
        path: { service_id },
        query: params,
      },
    },
    options,
  );
};
