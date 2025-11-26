import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type CurrentAccountParams = paths['/v1/account']['get']['parameters'];

type CurrentAccountData =
  paths['/v1/account']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useCurrentAccount = (
  options?: Options,
): UseQueryResult<CurrentAccountData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/account', {});
};
