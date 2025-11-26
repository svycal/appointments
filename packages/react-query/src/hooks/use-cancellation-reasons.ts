import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type CancellationReasonsParams =
  paths['/v1/cancellation_reasons']['get']['parameters'];

type CancellationReasonsData =
  paths['/v1/cancellation_reasons']['get']['responses'][200]['content']['application/json'];

export const useCancellationReasons = (
  client: Client,
): UseQueryResult<CancellationReasonsData, unknown> => {
  return client.useQuery('get', '/v1/cancellation_reasons', {});
};
