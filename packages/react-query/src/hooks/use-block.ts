import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type BlockParams = paths['/v1/blocks/{block_id}']['get']['parameters'];

type BlockData =
  paths['/v1/blocks/{block_id}']['get']['responses'][200]['content']['application/json'];

export const useBlock = (
  client: Client,
  block_id: BlockParams['path']['block_id'],
): UseQueryResult<BlockData, unknown> => {
  return client.useQuery('get', '/v1/blocks/{block_id}', {
    params: {
      path: { block_id },
    },
  });
};
