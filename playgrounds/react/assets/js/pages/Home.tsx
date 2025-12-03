import React, { ReactNode, useState, useEffect, useMemo } from "react";
import { RootLayout } from "../layouts/root-layout";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
} from "lucide-react";
import type { Slot } from "@savvycal/appointments-core";
import {
  usePublicServiceSlots,
  useCreatePublicAppointment,
} from "@savvycal/appointments-react-query";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import {
  formatISO,
  endOfMonth,
  startOfMonth,
  fromUnixTime,
  isSameDay,
  intlFormat,
  format,
} from "date-fns";
import { tz, tzName } from "@date-fns/tz";
import { RadioGroup } from "radix-ui";
import clsx from "clsx";

const SERVICE_ID = "srv_28f3a4bd5986";
const NAIVE_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

const Home = () => {
  const [timeZone, setTimeZone] = useState<string>();
  const defaultClassNames = getDefaultClassNames();

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
    <div className="flex flex-wrap gap-8 p-12 [--nav-height:--spacing(11)]">
      <div>
        <DayPicker
          animate
          disabled={(date) => !dateHasSlots(date)}
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          month={month}
          formatters={{
            formatWeekdayName: (weekday) =>
              weekday.toLocaleString("default", { weekday: "short" }),
          }}
          classNames={{
            root: clsx(
              defaultClassNames.root,
              "[--rdp-nav-height:var(--nav-height)]",
            ),
            month_caption: clsx(
              defaultClassNames.month_caption,
              "flex items-center justify-center",
            ),
            caption_label: clsx(
              defaultClassNames.caption_label,
              "text-base font-semibold text-zinc-900",
            ),
            nav: clsx(defaultClassNames.nav, "w-full flex justify-between"),
            button_next: clsx(
              defaultClassNames.button_next,
              "rounded-md hover:bg-zinc-100 active:bg-zinc-200",
              "size-(--rdp-day_button-width)",
            ),
            button_previous: clsx(
              defaultClassNames.button_previous,
              "rounded-md hover:bg-zinc-100 active:bg-zinc-200",
              "size-(--rdp-day_button-width)",
            ),
            chevron: clsx("text-zinc-900"),
            today: clsx(defaultClassNames.today, "text-zinc-900"),
            day: clsx(defaultClassNames.day, "group"),
            month_grid: clsx(defaultClassNames.month_grid),
            selected: "",
            day_button: clsx(
              defaultClassNames.day_button,
              "rounded-md",
              "group-[:not([data-disabled])]:bg-zinc-200 group-[:not([data-disabled])]:font-medium",
              "group-[:not([data-selected])]:text-zinc-800",
              "group-[[data-selected]]:bg-zinc-900 group-[[data-selected]]:text-white",
            ),
            disabled: clsx(
              defaultClassNames.disabled,
              "text-zinc-600 line-through",
            ),
            week: "grid grid-cols-7 gap-0.5",
            weekdays: "grid grid-cols-7 gap-0.5",
            weeks: "flex flex-col gap-0.5",
          }}
          components={{
            Chevron: ({ className, orientation, ...props }) => {
              if (orientation === "left") {
                return (
                  <ChevronLeftIcon
                    className={clsx("size-5", className)}
                    {...props}
                  />
                );
              }

              if (orientation === "right") {
                return (
                  <ChevronRightIcon
                    className={clsx("size-5", className)}
                    {...props}
                  />
                );
              }

              return (
                <ChevronDownIcon
                  className={clsx("size-5", className)}
                  {...props}
                />
              );
            },
          }}
          onMonthChange={(month) => {
            setMonth(month);
            setSelectedDay(undefined);
            setSelectedSlot(undefined);
          }}
        />
        {timeZone && (
          <div className="flex items-center justify-center gap-2 mt-6 text-sm">
            <GlobeIcon className="size-4 text-zinc-500" />
            <span className="text-zinc-500">
              {tzName(timeZone, selectedDay ?? new Date(), "long")}
            </span>
          </div>
        )}
      </div>
      {selectedDay && slotsOnSelectedDay && timeZone && (
        <div className="grow">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center h-(--nav-height)">
              <h2 className="text-center font-semibold">
                {intlFormat(selectedDay, {
                  day: "numeric",
                  month: "long",
                  weekday: "long",
                })}
              </h2>
            </div>
            <RadioGroup.Root
              className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3"
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
                    <label className="flex px-6 py-2 cursor-pointer justify-center text-base">
                      {intlFormat(slotStartAt, { timeStyle: "short" })}
                    </label>
                  </RadioGroup.Item>
                );
              })}
            </RadioGroup.Root>
            <div className="mt-6">
              <button
                type="submit"
                className={clsx(
                  "rounded-md w-full cursor-pointer text-white px-6 py-3 bg-zinc-900",
                  "hover:not-disabled:bg-zinc-800 active:not-disabled:brightness-90",
                  "focus-visible:ring-3 focus-visible:ring-zinc-900/25 focus:outline-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
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
