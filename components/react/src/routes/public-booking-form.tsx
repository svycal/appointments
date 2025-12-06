import { createFileRoute } from "@tanstack/react-router";

import { PublicBookingForm } from "../components/public-booking-form";

export const Route = createFileRoute("/public-booking-form")({
  component: PublicBookingFormDemo,
});

function PublicBookingFormDemo() {
  return <PublicBookingForm serviceId="srv_28f3a4bd5986" />;
}
