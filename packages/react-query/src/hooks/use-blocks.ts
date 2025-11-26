import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type BlocksParams = paths['/v1/blocks']['get']['parameters'];

type BlocksData =
  paths['/v1/blocks']['get']['responses'][200]['content']['application/json'];

export const useBlocks = (
  client: Client,
  params?: BlocksParams['query'],
): UseQueryResult<BlocksData, unknown> => {
  return client.useQuery('get', '/v1/blocks', {
    params: {
      query: params,
    },
  });
};
