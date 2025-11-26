import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type ProviderScheduleParams =
  paths['/v1/provider_schedules/{provider_schedule_id}']['get']['parameters'];

type ProviderScheduleData =
  paths['/v1/provider_schedules/{provider_schedule_id}']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useProviderSchedule = (
  provider_schedule_id: ProviderScheduleParams['path']['provider_schedule_id'],
  options?: Options,
): UseQueryResult<ProviderScheduleData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    'get',
    '/v1/provider_schedules/{provider_schedule_id}',
    {
      params: {
        path: { provider_schedule_id },
      },
    },
  );
};
