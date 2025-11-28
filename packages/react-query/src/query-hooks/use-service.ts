import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import type { Client } from "../client";

export type ServiceParams =
  paths["/v1/services/{service_id}"]["get"]["parameters"];

type ServiceData =
  paths["/v1/services/{service_id}"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
  enabled?: boolean;
}

export const useService = (
  service_id: ServiceParams["path"]["service_id"],
  options?: Options,
): UseQueryResult<ServiceData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/services/{service_id}",
    {
      params: {
        path: { service_id },
      },
    },
    { enabled: options?.enabled },
  );
};
