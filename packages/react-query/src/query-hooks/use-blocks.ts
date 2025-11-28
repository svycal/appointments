import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import type { Client } from "../client";

export type BlocksParams = paths["/v1/blocks"]["get"]["parameters"];

type BlocksData =
  paths["/v1/blocks"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
  enabled?: boolean;
}

export const useBlocks = (
  queryParams?: BlocksParams["query"],
  options?: Options,
): UseQueryResult<BlocksData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/blocks",
    {
      params: {
        query: queryParams,
      },
    },
    { enabled: options?.enabled },
  );
};
