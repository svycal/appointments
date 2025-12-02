import React, { ReactNode, useState, useEffect } from "react";
import { RootLayout } from "../layouts/root-layout";
import { usePublicServiceSlots } from "@savvycal/appointments-react-query";
import { DayPicker } from "react-day-picker";
import {
  formatISO,
  endOfMonth,
  startOfMonth,
  fromUnixTime,
  isSameDay,
} from "date-fns";
import { tz } from "@date-fns/tz";

const Home = () => {
  const [timeZone, setTimeZone] = useState<string>();

  // Infer the browser's time zone
  useEffect(() => {
    setTimeZone(new Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date>();

  const { data, isLoading } = usePublicServiceSlots("srv_28f3a4bd5986", {
    from: formatISO(month, { representation: "date" }),
    until: formatISO(endOfMonth(month), { representation: "date" }),
  });

  const dateHasSlots = (date: Date) => {
    if (!data || !timeZone) return false;

    return data.data.some((slot) => {
      const slotDate = fromUnixTime(slot.start_at_ts!);

      return isSameDay(slotDate, date, { in: tz(timeZone) });
    });
  };

  return (
    <div>
      <DayPicker
        animate
        disabled={(date) => !dateHasSlots(date)}
        mode="single"
        selected={selected}
        onSelect={setSelected}
        month={month}
        onMonthChange={setMonth}
      />

      {isLoading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
