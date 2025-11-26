import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type CancellationReasonParams =
  paths['/v1/cancellation_reasons/{cancellation_reason_id}']['get']['parameters'];

export const useCancellationReason = (
  client: Client,
  cancellation_reason_id: CancellationReasonParams['path']['cancellation_reason_id'],
) => {
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
