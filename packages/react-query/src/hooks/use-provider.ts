import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

export type ProviderParams =
  paths['/v1/providers/{provider_id}']['get']['parameters'];

export const useProvider = (
  client: Client,
  provider_id: ProviderParams['path']['provider_id'],
) => {
  return client.useQuery('get', '/v1/providers/{provider_id}', {
    params: {
      path: { provider_id },
    },
  });
};
