import React, { ReactNode, useState } from "react";
import { DateTime } from "luxon";
import { RootLayout } from "../layouts/root-layout";
import { usePublicServiceSlots } from "@savvycal/appointments-react-query";
import { DayPicker } from "react-day-picker";

const Home = () => {
  const [from, setFrom] = useState(DateTime.now().startOf("month"));

  const [selected, setSelected] = useState<Date>();

  const { data, isLoading } = usePublicServiceSlots("srv_28f3a4bd5986", {
    from: from.toISODate(),
    until: from.endOf("month").toISODate(),
  });

  return (
    <div>
      <DayPicker
        animate
        mode="single"
        selected={selected}
        onSelect={setSelected}
        footer={
          selected
            ? `Selected: ${selected.toLocaleDateString()}`
            : "Pick a day."
        }
      />
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
