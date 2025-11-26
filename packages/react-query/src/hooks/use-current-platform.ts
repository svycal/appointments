import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type CurrentPlatformParams = paths['/v1/platform']['get']['parameters'];

export const useCurrentPlatform = (client: Client) => {
  return client.useQuery('get', '/v1/platform', {});
};
