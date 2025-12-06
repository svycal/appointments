import type { FetchClient, paths } from "./client";

export function getEarliestPublicServiceSlot(
  client: FetchClient,
  service_id: paths["/v1/public/services/{service_id}/earliest_slot"]["get"]["parameters"]["path"]["service_id"],
) {
  return client.GET("/v1/public/services/{service_id}/earliest_slot", {
    params: { path: { service_id } },
  });
}
