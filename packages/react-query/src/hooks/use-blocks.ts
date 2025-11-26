import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type BlocksParams = paths['/v1/blocks']['get']['parameters'];

export const useBlocks = (client: Client, params?: BlocksParams['query']) => {
  return client.useQuery('get', '/v1/blocks', {
    params: {
      query: params,
    },
  });
};
