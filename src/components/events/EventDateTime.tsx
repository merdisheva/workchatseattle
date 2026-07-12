"use client";

import { useFormatter } from "next-intl";

interface FormattedEventDateProps {
  date: Date | string;
}

export function FormattedEventDate({ date }: FormattedEventDateProps) {
  const format = useFormatter();
  return (
    <>
      {format.dateTime(new Date(date), {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </>
  );
}

export function FormattedEventTime({ date }: FormattedEventDateProps) {
  const format = useFormatter();
  return (
    <>
      {format.dateTime(new Date(date), {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })}
    </>
  );
}
