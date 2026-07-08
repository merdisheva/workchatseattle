"use client";

interface FormattedEventDateProps {
  date: Date | string;
}

export function FormattedEventDate({ date }: FormattedEventDateProps) {
  return (
    <>
      {new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </>
  );
}

export function FormattedEventTime({ date }: FormattedEventDateProps) {
  return (
    <>
      {new Date(date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })}
    </>
  );
}
