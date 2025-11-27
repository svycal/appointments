import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import { Client } from "../client";

export type AccountUsersParams = paths["/v1/users"]["get"]["parameters"];

type AccountUsersData =
  paths["/v1/users"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
}

export const useAccountUsers = (
  options?: Options,
): UseQueryResult<AccountUsersData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery("get", "/v1/users", {});
};
