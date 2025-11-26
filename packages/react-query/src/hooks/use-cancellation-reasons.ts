import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type CancellationReasonsParams =
  paths['/v1/cancellation_reasons']['get']['parameters'];

export const useCancellationReasons = (
  client: Client,
  options?: any,
) => {
  return client.useQuery('get', '/v1/cancellation_reasons', {
  }, options);
};
