import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import type { Client } from "../client";

export type ServiceProvidersParams =
  paths["/v1/services/{service_id}/providers"]["get"]["parameters"];

type ServiceProvidersData =
  paths["/v1/services/{service_id}/providers"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
  enabled?: boolean;
}

export const useServiceProviders = (
  service_id: ServiceProvidersParams["path"]["service_id"],
  options?: Options,
): UseQueryResult<ServiceProvidersData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/services/{service_id}/providers",
    {
      params: {
        path: { service_id },
      },
    },
    { enabled: options?.enabled },
  );
};
