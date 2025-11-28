import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import type { Client } from "../client";

export type ProvidersParams = paths["/v1/providers"]["get"]["parameters"];

type ProvidersData =
  paths["/v1/providers"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
  enabled?: boolean;
}

export const useProviders = (
  queryParams?: ProvidersParams["query"],
  options?: Options,
): UseQueryResult<ProvidersData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/providers",
    {
      params: {
        query: queryParams,
      },
    },
    { enabled: options?.enabled },
  );
};
