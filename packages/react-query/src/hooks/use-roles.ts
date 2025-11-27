import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import { Client } from "../client";

export type RolesParams = paths["/v1/roles"]["get"]["parameters"];

type RolesData =
  paths["/v1/roles"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
}

export const useRoles = (
  options?: Options,
): UseQueryResult<RolesData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery("get", "/v1/roles", {});
};
