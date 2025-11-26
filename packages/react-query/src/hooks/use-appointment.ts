import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type AppointmentParams =
  paths['/v1/appointments/{appointment_id}']['get']['parameters'];

type AppointmentData =
  paths['/v1/appointments/{appointment_id}']['get']['responses'][200]['content']['application/json'];

export const useAppointment = (
  client: Client,
  appointment_id: AppointmentParams['path']['appointment_id'],
  params?: AppointmentParams['query'],
): UseQueryResult<AppointmentData, unknown> => {
  return client.useQuery('get', '/v1/appointments/{appointment_id}', {
    params: {
      path: { appointment_id },
      query: params,
    },
  });
};
