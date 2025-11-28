import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import type { Client } from "../client";

export type PublicServiceSlotsParams =
  paths["/v1/public/services/{service_id}/slots"]["get"]["parameters"];

type PublicServiceSlotsData =
  paths["/v1/public/services/{service_id}/slots"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
  enabled?: boolean;
}

export const usePublicServiceSlots = (
  service_id: PublicServiceSlotsParams["path"]["service_id"],
  queryParams: PublicServiceSlotsParams["query"],
  options?: Options,
): UseQueryResult<PublicServiceSlotsData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/public/services/{service_id}/slots",
    {
      params: {
        path: { service_id },
        query: queryParams,
      },
    },
    { enabled: options?.enabled },
  );
};
