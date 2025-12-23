import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { getEarliestPublicServiceSlot } from "@savvycal/appointments-core";
import {
  useCreatePublicAppointment,
  usePublicServiceSlots,
} from "@savvycal/appointments-react-query";
import { useSavvyCalFetchClient } from "@savvycal/appointments-react-query";
import {
  endOfMonth,
  formatDate,
  fromUnixTime,
  getBrowserTimeZone,
  getTimeZoneDisplayName,
  isSameDay,
  startOfMonth,
  toISODate,
  toISONaiveDateTime,
} from "@savvycal/appointments-utils";
import clsx from "clsx";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

const PublicBookingForm = ({ clientData, serviceId }) => {
  const [timeZone] = useState(getBrowserTimeZone());
  const client = useSavvyCalFetchClient();

  const [month, setMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const [selectedSlot, setSelectedSlot] = useState();
  const [initError, setInitError] = useState();

  useEffect(() => {
    async function jumpToEarliestDate() {
      try {
        const { data } = await getEarliestPublicServiceSlot(client, {
          service_id: serviceId,
        });

        setInitError(undefined);

        if (data?.data) {
          setMonth(startOfMonth(data.data.start_at));
          setSelectedDay(fromUnixTime(data.data.start_at_ts));
        } else {
          // No available slots, default to current month
          setMonth(startOfMonth(new Date()));
        }
      } catch {
        setInitError("Failed to load available times. Please try again.");
        setMonth(startOfMonth(new Date()));
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

  const {
    data,
    error: slotsError,
    refetch,
  } = usePublicServiceSlots(serviceId, visibleRange, {
    enabled: !!month,
  });

  const [submitError, setSubmitError] = useState();

  const { isPending: isCreating, mutate: createPublicAppointment } =
    useCreatePublicAppointment({
      onError: () => {
        setSubmitError("Failed to book appointment. Please try again.");
      },
      onSuccess: () => {
        setSelectedSlot(undefined);
        setSubmitError(undefined);
        refetch();
      },
    });

  const dateHasSlots = (date) => {
    if (!data) return false;

    return data.data.some((slot) => {
      const slotDate = fromUnixTime(slot.start_at_ts);

      return isSameDay(slotDate, date, timeZone);
    });
  };

  const slotsOnSelectedDay = useMemo(() => {
    if (!data || !selectedDay) return [];

    return data.data.filter((slot) => {
      const slotDate = fromUnixTime(slot.start_at_ts);
      return isSameDay(slotDate, selectedDay, timeZone);
    });
  }, [data, selectedDay, timeZone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    createPublicAppointment({
      body: {
        client_data: {
          email: clientData.email,
          first_name: clientData.first_name,
          last_name: clientData.last_name,
          locale: clientData.locale ?? "en",
          phone: clientData.phone ?? "",
          reference_id: clientData.reference_id ?? clientData.email,
          time_zone: timeZone,
        },
        end_at: toISONaiveDateTime(selectedSlot.end_at, timeZone),
        service_id: serviceId,
        start_at: toISONaiveDateTime(selectedSlot.start_at, timeZone),
        time_zone: timeZone,
      },
    });
  };

  const error =
    initError || (slotsError ? "Failed to load available times." : undefined);

  return (
    <div className="@container [--nav-height:--spacing(11)]">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
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
                !isSameDay(new Date(selectedSlot.start_at), day, timeZone)
              ) {
                setSelectedSlot(undefined);
              }
            }}
            selectedDay={selectedDay}
          />
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <GlobeIcon className="size-4 text-zinc-500" />
            <span className="text-zinc-500">
              {getTimeZoneDisplayName(timeZone)}
            </span>
          </div>
        </div>
        {selectedDay && slotsOnSelectedDay && (
          <div className="w-full max-w-sm grow @xl:w-auto @xl:max-w-none">
            <form onSubmit={handleSubmit}>
              <div className="flex h-(--nav-height) items-center justify-center">
                <h2 className="text-center font-semibold">
                  {formatDate(selectedDay, {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                  })}
                </h2>
              </div>
              <RadioGroup
                className="mt-3 grid gap-2 @2xl:grid-cols-2 @3xl:grid-cols-3"
                onValueChange={(value) =>
                  setSelectedSlot(
                    slotsOnSelectedDay.find(
                      (slot) => slot.start_at === String(value),
                    ),
                  )
                }
                value={selectedSlot?.start_at}
              >
                {slotsOnSelectedDay.map((slot) => {
                  const slotStartAt = fromUnixTime(slot.start_at_ts);

                  return (
                    <label
                      className={clsx(
                        "flex cursor-pointer justify-center rounded-md px-6 py-2.5 text-base text-zinc-900",
                        "ring-1 ring-zinc-900/20 ring-inset hover:bg-zinc-900/5",
                        "has-data-checked:ring-2 has-data-checked:ring-zinc-900",
                        "has-focus-visible:ring-3 has-focus-visible:ring-zinc-900/25",
                      )}
                      key={slot.start_at}
                    >
                      <Radio.Root className="sr-only" value={slot.start_at}>
                        <Radio.Indicator />
                      </Radio.Root>
                      {formatDate(slotStartAt, { timeStyle: "short" })}
                    </label>
                  );
                })}
              </RadioGroup>
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
                {submitError && (
                  <p className="mt-2 text-center text-sm text-red-600">
                    {submitError}
                  </p>
                )}
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
