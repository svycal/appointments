import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ProviderScheduleParams =
  paths['/v1/provider_schedules/{provider_schedule_id}']['get']['parameters'];

export const useProviderSchedule = (
  client: Client,
  provider_schedule_id: ProviderScheduleParams['path']['provider_schedule_id'],
  options?: any,
) => {
  return client.useQuery(
    'get',
    '/v1/provider_schedules/{provider_schedule_id}',
    {
      params: {
        path: { provider_schedule_id },
      },
    },
    options,
  );
};
