import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import { Client } from "../client";

export type ProviderParams =
  paths["/v1/providers/{provider_id}"]["get"]["parameters"];

type ProviderData =
  paths["/v1/providers/{provider_id}"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
}

export const useProvider = (
  provider_id: ProviderParams["path"]["provider_id"],
  options?: Options,
): UseQueryResult<ProviderData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery("get", "/v1/providers/{provider_id}", {
    params: {
      path: { provider_id },
    },
  });
};
