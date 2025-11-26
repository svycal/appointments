import type { Client } from '../client';
import type { UseQueryResult } from '@tanstack/react-query';
import { paths } from '@savvycal/appointments-core';

export type CurrentPlatformParams = paths['/v1/platform']['get']['parameters'];

type CurrentPlatformData =
  paths['/v1/platform']['get']['responses'][200]['content']['application/json'];

export const useCurrentPlatform = (
  client: Client,
): UseQueryResult<CurrentPlatformData, unknown> => {
  return client.useQuery('get', '/v1/platform', {});
};
