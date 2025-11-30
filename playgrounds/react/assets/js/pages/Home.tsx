import React, { ReactNode, useState } from "react";
import { DateTime } from "luxon";
import { RootLayout } from "../layouts/root-layout";
import {
  useCreatePublicAppointment,
  usePublicServiceSlots,
} from "@savvycal/appointments-react-query";

const Home = () => {
  const [from, setFrom] = useState(DateTime.now().startOf("month"));

  const { data, isLoading } = usePublicServiceSlots("srv_28f3a4bd5986", {
    from: from.toISODate(),
    until: from.endOf("month").toISODate(),
  });

  const { mutate } = useCreatePublicAppointment();

  mutate({
    body: {
      client_data: {
        email: "derrick@savvycal.app",
        first_name: "Derrick",
        last_name: "Reimer",
        locale: "en",
        phone: "+15555555555",
        time_zone: "America/New_York",
      },
      end_at: "2025-12-01T12:00:00Z",
      start_at: "2025-12-01T12:00:00Z",
      service_id: "srv_28f3a4bd5986",
    },
  });

  return (
    <div>
      <button
        className="bg-zinc-400 p-3 rounded"
        onClick={() => {
          setFrom(from.minus({ months: 1 }));
        }}
      >
        Previous Month
      </button>
      <button
        className="bg-zinc-400 p-3 rounded"
        onClick={() => {
          setFrom(from.plus({ months: 1 }));
        }}
      >
        Next Month
      </button>
      {isLoading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
