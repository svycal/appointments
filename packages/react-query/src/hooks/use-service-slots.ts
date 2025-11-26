import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ServiceSlotsParams =
  paths['/v1/services/{service_id}/slots']['get']['parameters'];

type ServiceSlotsData =
  paths['/v1/services/{service_id}/slots']['get']['responses'][200]['content']['application/json'];

export const useServiceSlots = (
  client: Client,
  service_id: ServiceSlotsParams['path']['service_id'],
  params: ServiceSlotsParams['query'],
): UseQueryResult<ServiceSlotsData, unknown> => {
  return client.useQuery('get', '/v1/services/{service_id}/slots', {
    params: {
      path: { service_id },
      query: params,
    },
  });
};
