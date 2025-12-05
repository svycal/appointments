import type { Slot } from "@savvycal/appointments-core";

import { tz, tzName } from "@date-fns/tz";
import {
  useCreatePublicAppointment,
  usePublicServiceSlots,
} from "@savvycal/appointments-react-query";
import { useSavvyCalFetchClient } from "@savvycal/appointments-react-query";
import {
  getBrowserTimeZone,
  toISODate,
  toISONaiveDateTime,
} from "@savvycal/appointments-utils";
import clsx from "clsx";
import {
  endOfMonth,
  fromUnixTime,
  intlFormat,
  isSameDay,
  startOfMonth,
} from "date-fns";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
} from "lucide-react";
import { RadioGroup } from "radix-ui";
import React, { useEffect, useMemo, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

const PublicBookingForm = ({ serviceId }: { serviceId: string }) => {
  const [timeZone] = useState<string>(getBrowserTimeZone());
  const client = useSavvyCalFetchClient();

  const [month, setMonth] = useState<Date>();
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<Slot>();

  useEffect(() => {
    async function jumpToEarliestDate() {
      const { data } = await client.GET(
        "/v1/public/services/{service_id}/earliest_slot",
        {
          params: { path: { service_id: serviceId } },
        },
      );

      if (data?.data) {
        setMonth(startOfMonth(data.data.start_at));
        setSelectedDay(fromUnixTime(data.data.start_at_ts));
      }
    }

    if (!month && !selectedDay) {
      jumpToEarliestDate();
    }
  }, [client, month, selectedDay, serviceId]);

  const visibleRange = useMemo(() => {
    if (!month) return { from: "", until: "" };

    return {
      from: toISODate(month),
      until: toISODate(endOfMonth(month)),
    };
  }, [month]);

  const { data, refetch } = usePublicServiceSlots(serviceId, visibleRange, {
    enabled: !!month,
  });

  const { isPending: isCreating, mutate: createPublicAppointment } =
    useCreatePublicAppointment({
      onSuccess: () => {
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
        client_data: {
          email: "derrick@savvycal.com",
          first_name: "Derrick",
          last_name: "Reimer",
          locale: "en",
          phone: "",
          reference_id: "derrick@savvycal.com",
          time_zone: timeZone,
        },
        end_at: toISONaiveDateTime(selectedSlot.end_at, timeZone),
        service_id: serviceId,
        start_at: toISONaiveDateTime(selectedSlot.start_at, timeZone),
        time_zone: timeZone,
      },
    });
  };

  return (
    <div className="@container [--nav-height:--spacing(11)]">
      <div className="flex flex-col items-center gap-8 @xl:flex-row @xl:items-start">
        <div>
          <Calendar
            disabled={(date) => !dateHasSlots(date)}
            month={month}
            onMonthChange={(month) => {
              setMonth(month);
              setSelectedDay(undefined);
              setSelectedSlot(undefined);
            }}
            onSelect={(day) => {
              setSelectedDay(day);

              if (
                day &&
                selectedSlot &&
                !isSameDay(selectedSlot.start_at, day)
              ) {
                setSelectedSlot(undefined);
              }
            }}
            selectedDay={selectedDay}
          />
          {timeZone && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              <GlobeIcon className="size-4 text-zinc-500" />
              <span className="text-zinc-500">
                {tzName(timeZone, selectedDay ?? new Date(), "long")}
              </span>
            </div>
          )}
        </div>
        {selectedDay && slotsOnSelectedDay && timeZone && (
          <div className="w-full max-w-sm grow @xl:w-auto @xl:max-w-none">
            <form onSubmit={handleSubmit}>
              <div className="flex h-(--nav-height) items-center justify-center">
                <h2 className="text-center font-semibold">
                  {intlFormat(selectedDay, {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                  })}
                </h2>
              </div>
              <RadioGroup.Root
                className="mt-3 grid gap-2 @2xl:grid-cols-2 @3xl:grid-cols-3"
                onValueChange={(value) =>
                  setSelectedSlot(
                    slotsOnSelectedDay.find((slot) => slot.start_at === value),
                  )
                }
                value={selectedSlot?.start_at || null}
              >
                {slotsOnSelectedDay.map((slot) => {
                  const slotStartAt = fromUnixTime(slot.start_at_ts);

                  return (
                    <RadioGroup.Item
                      className={clsx(
                        "rounded-md text-zinc-900 ring-1 ring-zinc-900/20 ring-inset hover:bg-zinc-900/5",
                        "data-[state=checked]:ring-2 data-[state=checked]:ring-zinc-900",
                        "focus:outline-none focus-visible:ring-3 focus-visible:ring-zinc-900/25",
                        "group",
                      )}
                      key={slot.start_at}
                      value={slot.start_at}
                    >
                      <label className="flex cursor-pointer justify-center px-6 py-2.5 text-base">
                        {intlFormat(slotStartAt, { timeStyle: "short" })}
                      </label>
                    </RadioGroup.Item>
                  );
                })}
              </RadioGroup.Root>
              <div className="mt-6">
                <button
                  className={clsx(
                    "w-full cursor-pointer rounded-md bg-zinc-900 px-6 py-3 text-white",
                    "hover:not-disabled:bg-zinc-800 active:not-disabled:brightness-90",
                    "focus:outline-none focus-visible:ring-3 focus-visible:ring-zinc-900/25",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                  disabled={!selectedSlot || isCreating}
                  type="submit"
                >
                  {isCreating ? "Submitting..." : "Book appointment"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Calendar = ({
  disabled,
  month,
  onMonthChange,
  onSelect,
  selectedDay,
}: {
  disabled: (date: Date) => boolean;
  month: Date | undefined;
  onMonthChange: (month: Date) => void;
  onSelect: (day: Date | undefined) => void;
  selectedDay: Date | undefined;
}) => {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      animate
      classNames={{
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
        caption_label: clsx(
          defaultClassNames.caption_label,
          "text-base font-semibold text-zinc-900",
        ),
        chevron: clsx("text-zinc-900"),
        day: clsx(defaultClassNames.day, "group"),
        day_button: clsx(
          defaultClassNames.day_button,
          "rounded-md text-zinc-900",
          "group-[:not([data-disabled])]:bg-zinc-200 group-[:not([data-disabled])]:font-medium",
          "group-[:not([data-selected])]:text-zinc-800",
          "group-[[data-selected]]:bg-zinc-900 group-[[data-selected]]:text-white",
        ),
        disabled: clsx(
          defaultClassNames.disabled,
          "text-zinc-600 line-through",
        ),
        month_caption: clsx(
          defaultClassNames.month_caption,
          "flex items-center justify-center",
        ),
        month_grid: clsx(defaultClassNames.month_grid),
        nav: clsx(defaultClassNames.nav, "w-full flex justify-between"),
        root: clsx(
          defaultClassNames.root,
          "[--rdp-nav-height:var(--nav-height)]",
        ),
        selected: "",
        today: clsx(defaultClassNames.today, "text-zinc-900"),
        week: "grid grid-cols-7 gap-0.5",
        weekday: clsx(defaultClassNames.weekday, "py-3 text-zinc-900"),
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
            <ChevronDownIcon className={clsx("size-5", className)} {...props} />
          );
        },
      }}
      disabled={disabled}
      formatters={{
        formatWeekdayName: (weekday) =>
          weekday.toLocaleString("default", { weekday: "short" }),
      }}
      mode="single"
      month={month}
      onMonthChange={onMonthChange}
      onSelect={onSelect}
      selected={selectedDay}
    />
  );
};

export { PublicBookingForm };
