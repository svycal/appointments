import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { RootLayout } from "../layouts/root-layout";
import type { Slot } from "@savvycal/appointments-core";
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
  format,
} from "date-fns";
import { tz } from "@date-fns/tz";
import { RadioGroup } from "radix-ui";

const SERVICE_ID = "srv_28f3a4bd5986";
const NAIVE_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

const Home = () => {
  const [timeZone, setTimeZone] = useState<string>();

  // Infer the browser's time zone
  useEffect(() => {
    setTimeZone(new Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<Slot>();

  const { data, isLoading, refetch } = usePublicServiceSlots(SERVICE_ID, {
    from: formatISO(month, { representation: "date" }),
    until: formatISO(endOfMonth(month), { representation: "date" }),
  });

  const { mutate: createPublicAppointment, isPending: isCreating } =
    useCreatePublicAppointment({
      onSuccess: (resp) => {
        console.log(resp);
        setSelectedSlot(undefined);
        refetch();
      },
    });

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

    createPublicAppointment({
      body: {
        start_at: format(selectedSlot.start_at, NAIVE_DATETIME_FORMAT, {
          in: tz(timeZone),
        }),
        end_at: format(selectedSlot.end_at, NAIVE_DATETIME_FORMAT, {
          in: tz(timeZone),
        }),
        service_id: SERVICE_ID,
        time_zone: timeZone,
        client_data: {
          email: "derrick@savvycal.com",
          first_name: "Derrick",
          last_name: "Reimer",
          locale: "en",
          phone: "",
          reference_id: "derrick@savvycal.com",
          time_zone: timeZone,
        },
      },
    });
  };

  return (
    <div className="flex gap-6 p-12">
      <DayPicker
        animate
        disabled={(date) => !dateHasSlots(date)}
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={month}
        onMonthChange={(month) => {
          setMonth(month);
          setSelectedDay(undefined);
          setSelectedSlot(undefined);
        }}
      />
      {selectedDay && slotsOnSelectedDay && timeZone && (
        <div className="grow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-center font-semibold">
              {intlFormat(selectedDay, {
                day: "numeric",
                month: "long",
                weekday: "long",
              })}
            </h2>
            <RadioGroup.Root
              className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3"
              value={selectedSlot?.start_at || null}
              onValueChange={(value) =>
                setSelectedSlot(
                  slotsOnSelectedDay.find((slot) => slot.start_at === value),
                )
              }
            >
              {slotsOnSelectedDay.map((slot) => {
                const slotStartAt = fromUnixTime(slot.start_at_ts);

                return (
                  <RadioGroup.Item
                    key={slot.start_at}
                    value={slot.start_at}
                    className="rounded-md ring-inset ring-1 ring-zinc-900/30  focus:outline-none hover:bg-zinc-900/5 data-[state=checked]:ring-zinc-900 data-[state=checked]:ring-2 focus-visible:ring-3 focus-visible:ring-zinc-900/25"
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
                type="submit"
                className="rounded-md w-full bg-zinc-900 hover:bg-zinc-800 active:brightness-90 focus-visible:ring-3 focus-visible:ring-zinc-900/25 cursor-pointer text-white px-6 py-3 focus:outline-none"
                disabled={!selectedSlot || isCreating}
              >
                {isCreating ? "Submitting..." : "Book appointment"}
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
