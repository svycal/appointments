import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';
import { useSavvyCalClient } from '../provider';
import { Client } from '../client';

export type CurrentPlatformParams = paths['/v1/platform']['get']['parameters'];

type CurrentPlatformData =
  paths['/v1/platform']['get']['responses'][200]['content']['application/json'];

interface Options {
  client?: Client;
}

export const useCurrentPlatform = (
  options?: Options,
): UseQueryResult<CurrentPlatformData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery('get', '/v1/platform', {});
};
