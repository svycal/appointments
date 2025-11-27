import type { UseQueryResult } from "@tanstack/react-query";
import { paths } from "@savvycal/appointments-core";
import { useSavvyCalClient } from "../provider";
import { Client } from "../client";

export type CancellationReasonParams =
  paths["/v1/cancellation_reasons/{cancellation_reason_id}"]["get"]["parameters"];

type CancellationReasonData =
  paths["/v1/cancellation_reasons/{cancellation_reason_id}"]["get"]["responses"][200]["content"]["application/json"];

interface Options {
  client?: Client;
}

export const useCancellationReason = (
  cancellation_reason_id: CancellationReasonParams["path"]["cancellation_reason_id"],
  options?: Options,
): UseQueryResult<CancellationReasonData, unknown> => {
  const client = useSavvyCalClient(options?.client);

  return client.useQuery(
    "get",
    "/v1/cancellation_reasons/{cancellation_reason_id}",
    {
      params: {
        path: { cancellation_reason_id },
      },
    },
  );
};
