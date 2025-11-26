import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type BlocksParams = paths['/v1/blocks']['get']['parameters'];

type BlocksData =
  paths['/v1/blocks']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useBlocks = (
  params?: BlocksParams['query'],
  options?: Options,
): UseQueryResult<BlocksData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/blocks', {
    params: {
      query: params,
    },
  });
};
