import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type ServiceSlotsParams =
  paths['/v1/services/{service_id}/slots']['get']['parameters'];

type ServiceSlotsData =
  paths['/v1/services/{service_id}/slots']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useServiceSlots = (
  service_id: ServiceSlotsParams['path']['service_id'],
  params: ServiceSlotsParams['query'],
  options?: Options,
): UseQueryResult<ServiceSlotsData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/services/{service_id}/slots', {
    params: {
      path: { service_id },
      query: params,
    },
  });
};
