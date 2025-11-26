import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type AppointmentsParams = paths['/v1/appointments']['get']['parameters'];

type AppointmentsData =
  paths['/v1/appointments']['get']['responses'][200]['content']['application/json'];

export const useAppointments = (
  client: Client,
  params?: AppointmentsParams['query'],
): UseQueryResult<AppointmentsData, unknown> => {
  return client.useQuery('get', '/v1/appointments', {
    params: {
      query: params,
    },
  });
};
