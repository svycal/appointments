import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type BlockParams = paths['/v1/blocks/{block_id}']['get']['parameters'];

type BlockData =
  paths['/v1/blocks/{block_id}']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useBlock = (
  block_id: BlockParams['path']['block_id'],
  options?: Options,
): UseQueryResult<BlockData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/blocks/{block_id}', {
    params: {
      path: { block_id },
    },
  });
};
