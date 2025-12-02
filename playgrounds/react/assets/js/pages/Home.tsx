import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { RootLayout } from "../layouts/root-layout";
import {
  usePublicServiceSlots,
  useCreatePublicAppointment,
} from "@savvycal/appointments-react-query";
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

const SERVICE_ID = "srv_28f3a4bd5986";

const Home = () => {
  const [timeZone, setTimeZone] = useState<string>();

  // Infer the browser's time zone
  useEffect(() => {
    setTimeZone(new Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>();

  const { data, isLoading } = usePublicServiceSlots(SERVICE_ID, {
    from: formatISO(month, { representation: "date" }),
    until: formatISO(endOfMonth(month), { representation: "date" }),
  });

  const { mutate } = useCreatePublicAppointment();

  const dateHasSlots = (date: Date) => {
    if (!data || !timeZone) return false;

    return data.data.some((slot) => {
      const slotDate = fromUnixTime(slot.start_at_ts);

      return isSameDay(slotDate, date, { in: tz(timeZone) });
    });
  };

  const slotsOnSelectedDay = useMemo(() => {
    if (!data || !timeZone || !selectedDay) return [];

    return data.data.filter((slot) => {
      const slotDate = fromUnixTime(slot.start_at_ts!);

      return isSameDay(slotDate, selectedDay, { in: tz(timeZone) });
    });
  }, [data, selectedDay, timeZone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !timeZone) return;

    console.log("submit", { selectedSlot });
    mutate({
      body: {
        start_at: selectedSlot,
        service_id: SERVICE_ID,
        client_data: {
          email: "",
          first_name: "",
          last_name: "",
          locale: "en",
          phone: "",
          time_zone: timeZone,
        },
      },
    });
  };

  return (
    <div className="flex gap-4">
      <DayPicker
        animate
        disabled={(date) => !dateHasSlots(date)}
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={month}
        onMonthChange={setMonth}
      />
      {selectedDay && slotsOnSelectedDay && timeZone && (
        <div className="grow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-center font-bold">
              {intlFormat(selectedDay, {
                day: "numeric",
                month: "long",
                weekday: "long",
              })}
            </h2>
            <RadioGroup.Root
              className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3"
              value={selectedSlot}
              onValueChange={setSelectedSlot}
            >
              {slotsOnSelectedDay.map((slot) => {
                const slotStartAt = fromUnixTime(slot.start_at_ts);

                return (
                  <RadioGroup.Item
                    key={slot.start_at_ts}
                    value={slot.start_at}
                    className="rounded-md border border-black/30 focus:border-black/50 hover:bg-black/5 data-[state=checked]:border-black focus:ring-3 focus:ring-black/25"
                  >
                    <label className="flex px-6 py-3 cursor-pointer justify-center">
                      {intlFormat(slotStartAt, { timeStyle: "short" })}
                    </label>
                  </RadioGroup.Item>
                );
              })}
            </RadioGroup.Root>
            <div className="mt-6">
              <button
                className="rounded-md w-full bg-black text-white px-6 py-3"
                disabled={!selectedSlot}
              >
                Book appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

Home.layout = (page: ReactNode) => <RootLayout>{page}</RootLayout>;

export default Home;
