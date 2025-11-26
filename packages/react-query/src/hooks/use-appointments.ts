import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type AppointmentsParams = paths['/v1/appointments']['get']['parameters'];

type AppointmentsData =
  paths['/v1/appointments']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useAppointments = (
  queryParams?: AppointmentsParams['query'],
  options?: Options,
): UseQueryResult<AppointmentsData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/appointments', {
    params: {
      query: queryParams,
    },
  });
};
