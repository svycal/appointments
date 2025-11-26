import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type CancellationReasonsParams =
  paths['/v1/cancellation_reasons']['get']['parameters'];

type CancellationReasonsData =
  paths['/v1/cancellation_reasons']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useCancellationReasons = (
  options?: Options,
): UseQueryResult<CancellationReasonsData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/cancellation_reasons', {});
};
