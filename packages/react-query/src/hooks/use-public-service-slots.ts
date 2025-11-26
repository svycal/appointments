import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type PublicServiceSlotsParams =
  paths['/v1/public/services/{service_id}/slots']['get']['parameters'];

type PublicServiceSlotsData =
  paths['/v1/public/services/{service_id}/slots']['get']['responses'][200]['content']['application/json'];

export const usePublicServiceSlots = (
  client: Client,
  service_id: PublicServiceSlotsParams['path']['service_id'],
  params: PublicServiceSlotsParams['query'],
): UseQueryResult<PublicServiceSlotsData, unknown> => {
  return client.useQuery('get', '/v1/public/services/{service_id}/slots', {
    params: {
      path: { service_id },
      query: params,
    },
  });
};
