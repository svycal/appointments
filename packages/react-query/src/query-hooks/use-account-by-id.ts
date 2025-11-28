import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import type { Client } from "../client";

export type AccountByIdParams =
  paths["/v1/accounts/{account_id}"]["get"]["parameters"];

type AccountByIdData =
  paths["/v1/accounts/{account_id}"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
  enabled?: boolean;
}

export const useAccountById = (
  account_id: AccountByIdParams["path"]["account_id"],
  options?: Options,
): UseQueryResult<AccountByIdData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/accounts/{account_id}",
    {
      params: {
        path: { account_id },
      },
    },
    { enabled: options?.enabled },
  );
};
