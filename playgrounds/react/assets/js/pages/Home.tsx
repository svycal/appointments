import React, { ReactNode, useState } from "react";
import { RootLayout } from "../layouts/root-layout";
import { usePublicServiceSlots } from "@savvycal/appointments-react-query";
import { DayPicker } from "react-day-picker";
import { formatISO, endOfMonth, startOfMonth, sub, add } from "date-fns";

const Home = () => {
  const [from, setFrom] = useState(startOfMonth(new Date()));

  const [selected, setSelected] = useState<Date>();

  const { data, isLoading } = usePublicServiceSlots("srv_28f3a4bd5986", {
    from: formatISO(from, { representation: "date" }),
    until: formatISO(endOfMonth(from), { representation: "date" }),
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
          setFrom(sub(from, { months: 1 }));
        }}
      >
        Previous Month
      </button>
      <button
        className="bg-zinc-400 p-3 rounded"
        onClick={() => {
          setFrom(add(from, { months: 1 }));
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
