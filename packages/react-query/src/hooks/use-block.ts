import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type BlockParams =
  paths['/v1/blocks/{block_id}']['get']['parameters'];

export const useBlock = (
  client: Client,
  block_id: BlockParams['path']['block_id'],
  options?: any,
) => {
  return client.useQuery('get', '/v1/blocks/{block_id}', {
    params: {
      path: { block_id },
    },
  }, options);
};
