import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type ClientParams =
  paths['/v1/clients/{client_id}']['get']['parameters'];

type ClientData =
  paths['/v1/clients/{client_id}']['get']['responses'][200]['content']['application/json'];

export const useClient = (
  client: Client,
  client_id: ClientParams['path']['client_id'],
): UseQueryResult<ClientData, unknown> => {
  return client.useQuery('get', '/v1/clients/{client_id}', {
    params: {
      path: { client_id },
    },
  });
};
