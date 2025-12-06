import type { FetchClient, PathParams, RequestBody } from "./client";

export function createAppointment(
  client: FetchClient,
  body: RequestBody<"/v1/appointments", "post">,
) {
  return client.POST("/v1/appointments", {
    body,
  });
}

export function getEarliestPublicServiceSlot(
  client: FetchClient,
  path: PathParams<"/v1/public/services/{service_id}/earliest_slot", "get">,
) {
  return client.GET("/v1/public/services/{service_id}/earliest_slot", {
    params: { path },
  });
}
