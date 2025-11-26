import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type AppointmentParams =
  paths['/v1/appointments/{appointment_id}']['get']['parameters'];

type AppointmentData =
  paths['/v1/appointments/{appointment_id}']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useAppointment = (
  appointment_id: AppointmentParams['path']['appointment_id'],
  queryParams?: AppointmentParams['query'],
  options?: Options,
): UseQueryResult<AppointmentData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/appointments/{appointment_id}', {
    params: {
      path: { appointment_id },
      query: queryParams,
    },
  });
};
