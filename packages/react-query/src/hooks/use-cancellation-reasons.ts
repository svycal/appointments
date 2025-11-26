import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type CancellationReasonsParams =
  paths['/v1/cancellation_reasons']['get']['parameters'];

export const useCancellationReasons = (client: Client) => {
  return client.useQuery('get', '/v1/cancellation_reasons', {});
};
