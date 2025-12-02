import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { RootLayout } from "../layouts/root-layout";
import { usePublicServiceSlots } from "@savvycal/appointments-react-query";
import { DayPicker } from "react-day-picker";
import {
  formatISO,
  endOfMonth,
  startOfMonth,
  fromUnixTime,
  isSameDay,
  intlFormat,
} from "date-fns";
import { tz } from "@date-fns/tz";
import { RadioGroup } from "radix-ui";

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

  const slotsOnSelectedDay = useMemo(() => {
    if (!data || !timeZone) return [];

    return data.data.filter((slot) => {
      const slotDate = fromUnixTime(slot.start_at_ts!);

      return isSameDay(slotDate, selected!, { in: tz(timeZone) });
    });
  }, [data, selected, timeZone]);

  return (
    <div className="flex gap-4">
      <DayPicker
        animate
        disabled={(date) => !dateHasSlots(date)}
        mode="single"
        selected={selected}
        onSelect={setSelected}
        month={month}
        onMonthChange={setMonth}
      />
      {selected && slotsOnSelectedDay && timeZone && (
        <div>
          <form>
            <h2>
              {intlFormat(selected, {
                day: "numeric",
                month: "long",
                weekday: "long",
              })}
            </h2>
            <RadioGroup.Root className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {slotsOnSelectedDay.map((slot) => {
                const slotStartAt = fromUnixTime(slot.start_at_ts);

                return (
                  <RadioGroup.Item
                    key={slot.start_at_ts}
                    value={slot.start_at}
                    className="rounded-md border focus:border-black/50 hover:bg-black/5 data-[state=checked]:border-black focus:ring-3 focus:ring-black/25"
                  >
                    <label className="flex px-6 py-3 cursor-pointer justify-center">
                      {intlFormat(slotStartAt, { timeStyle: "short" })}
                    </label>
                  </RadioGroup.Item>
                );
              })}
            </RadioGroup.Root>
          </form>
        </div>
      )}
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
