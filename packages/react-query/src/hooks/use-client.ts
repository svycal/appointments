import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type ClientParams =
  paths['/v1/clients/{client_id}']['get']['parameters'];

type ClientData =
  paths['/v1/clients/{client_id}']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useClient = (
  client_id: ClientParams['path']['client_id'],
  options?: Options,
): UseQueryResult<ClientData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/clients/{client_id}', {
    params: {
      path: { client_id },
    },
  });
};
