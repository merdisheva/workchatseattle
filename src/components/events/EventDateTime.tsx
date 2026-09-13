"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface FormattedEventDateProps {
  date: Date | string;
}

// Formatted natively (not via next-intl's useFormatter) so the viewer's own
// browser time zone is used instead of the server's. The value is computed
// only after mount so React actually re-renders with the client's time zone
// instead of silently keeping the server-rendered one.
function useClientFormattedDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions
) {
  const locale = useLocale();
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(new Intl.DateTimeFormat(locale, options).format(new Date(date)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, locale, JSON.stringify(options)]);

  return formatted;
}

export function FormattedEventDate({ date }: FormattedEventDateProps) {
  const formatted = useClientFormattedDate(date, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return <>{formatted}</>;
}

export function FormattedEventTime({ date }: FormattedEventDateProps) {
  const formatted = useClientFormattedDate(date, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return <>{formatted}</>;
}
