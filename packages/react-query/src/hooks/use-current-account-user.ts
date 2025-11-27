import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import { Client } from "../client";

export type CurrentAccountUserParams = paths["/v1/user"]["get"]["parameters"];

type CurrentAccountUserData =
  paths["/v1/user"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
}

export const useCurrentAccountUser = (
  options?: Options,
): UseQueryResult<CurrentAccountUserData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery("get", "/v1/user", {});
};
