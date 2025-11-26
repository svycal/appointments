import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type CancellationReasonParams =
  paths['/v1/cancellation_reasons/{cancellation_reason_id}']['get']['parameters'];

type CancellationReasonData =
  paths['/v1/cancellation_reasons/{cancellation_reason_id}']['get']['responses'][200]['content']['application/json'];

export const useCancellationReason = (
  client: Client,
  cancellation_reason_id: CancellationReasonParams['path']['cancellation_reason_id'],
): UseQueryResult<CancellationReasonData, unknown> => {
  return client.useQuery(
    'get',
    '/v1/cancellation_reasons/{cancellation_reason_id}',
    {
      params: {
        path: { cancellation_reason_id },
      },
    },
  );
};
