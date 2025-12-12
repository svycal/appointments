import { createFileRoute } from "@tanstack/react-router";

import { PublicBookingForm } from "../components/public-booking-form";

export const Route = createFileRoute("/public-booking-form")({
  component: PublicBookingFormDemo,
});

function PublicBookingFormDemo() {
  return (
    <div className="p-6">
      <PublicBookingForm
        clientData={{
          email: "harrison@example.com",
          first_name: "Harrison",
          last_name: "Fitch",
        }}
        serviceId="srv_28f3a4bd5986"
      />
    </div>
  );
}
