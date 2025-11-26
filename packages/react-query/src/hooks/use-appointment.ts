import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type AppointmentParams =
  paths['/v1/appointments/{appointment_id}']['get']['parameters'];

export const useAppointment = (
  client: Client,
  appointment_id: AppointmentParams['path']['appointment_id'],
  params?: AppointmentParams['query'],
) => {
  return client.useQuery('get', '/v1/appointments/{appointment_id}', {
    params: {
      path: { appointment_id },
      query: params,
    },
  });
};
