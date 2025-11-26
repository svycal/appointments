import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type CurrentAccountParams = paths['/v1/account']['get']['parameters'];

export const useCurrentAccount = (client: Client) => {
  return client.useQuery('get', '/v1/account', {});
};
