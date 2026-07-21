"use client";

import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { Calendar, MapPin, Video, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedEventDate, FormattedEventTime } from "./EventDateTime";
import { useTranslations, useLocale } from "next-intl";

interface Event {
  id: string;
  title: string;
  titleRu?: string | null;
  description: string;
  descriptionRu?: string | null;
  date: Date;
  isOnline: boolean;
  zoomLink?: string | null;
  location?: string | null;
  recordingUrl?: string | null;
  imageUrl?: string | null;
}

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

export default function EventCard({ event, isPast = false }: EventCardProps) {
  const t = useTranslations("Events");
  const locale = useLocale();
  const { data: session } = useSession();

  const isApproved =
    session?.user?.status === "ACTIVE" || session?.user?.role === "ADMIN";

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? t("badgePast") : t("badgeUpcoming")}
          </Badge>
          <Badge variant="outline">
            {event.isOnline ? t("online") : t("inPerson")}
          </Badge>
        </div>

        <h3 className="mb-2 text-lg font-semibold">
          {locale === "ru" && event.titleRu ? event.titleRu : event.title}
        </h3>

        <div className="mb-3 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              <FormattedEventDate date={event.date} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="ml-6">
              <FormattedEventTime date={event.date} />
            </span>
          </div>
          {event.isOnline ? (
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>{t("virtualEvent")}</span>
            </div>
          ) : event.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          ) : null}
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {locale === "ru" && event.descriptionRu ? event.descriptionRu : event.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${event.id}`}>{t("viewDetails")}</Link>
          </Button>
          {isPast && event.recordingUrl && (
            isApproved ? (
              <Button size="sm" asChild>
                <a
                  href={event.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("watchRecording")}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="secondary" asChild>
                <Link href={`/events/${event.id}`}>
                  <Lock className="mr-1 h-3 w-3 text-muted-foreground" />
                  {t("watchRecording")}
                </Link>
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
