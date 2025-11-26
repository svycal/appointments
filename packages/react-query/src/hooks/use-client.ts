import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ClientParams = paths['/v1/clients/{client_id}']['get']['parameters'];

export const useClient = (
  client: Client,
  client_id: ClientParams['path']['client_id'],
) => {
  return client.useQuery('get', '/v1/clients/{client_id}', {
    params: {
      path: { client_id },
    },
  });
};
