import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ProviderParams =
  paths['/v1/providers/{provider_id}']['get']['parameters'];

type ProviderData =
  paths['/v1/providers/{provider_id}']['get']['responses'][200]['content']['application/json'];

export const useProvider = (
  client: Client,
  provider_id: ProviderParams['path']['provider_id'],
): UseQueryResult<ProviderData, unknown> => {
  return client.useQuery('get', '/v1/providers/{provider_id}', {
    params: {
      path: { provider_id },
    },
  });
};
