import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ProviderScheduleParams =
  paths['/v1/provider_schedules/{provider_schedule_id}']['get']['parameters'];

type ProviderScheduleData =
  paths['/v1/provider_schedules/{provider_schedule_id}']['get']['responses'][200]['content']['application/json'];

export const useProviderSchedule = (
  client: Client,
  provider_schedule_id: ProviderScheduleParams['path']['provider_schedule_id'],
): UseQueryResult<ProviderScheduleData, unknown> => {
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
