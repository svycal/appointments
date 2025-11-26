import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type AppointmentsParams = paths['/v1/appointments']['get']['parameters'];

export const useAppointments = (
  client: Client,
  params?: AppointmentsParams['query'],
  options?: any,
) => {
  return client.useQuery(
    'get',
    '/v1/appointments',
    {
      params: {
        query: params,
      },
    },
    options,
  );
};
