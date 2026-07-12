import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Video,
  ArrowLeft,
  ExternalLink,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations, getLocale } from "next-intl/server";
import { FormattedEventDate, FormattedEventTime } from "@/components/events/EventDateTime";

interface EventPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  return event;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const title = locale === "ru" && event.titleRu ? event.titleRu : event.title;
  const description = locale === "ru" && event.descriptionRu ? event.descriptionRu : event.description;

  return {
    title,
    description: description.substring(0, 160),
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id, locale } = await params;
  const [event, t] = await Promise.all([
    getEvent(id),
    getTranslations("Events"),
  ]);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date) < new Date();

  const title = locale === "ru" && event.titleRu ? event.titleRu : event.title;
  const description = locale === "ru" && event.descriptionRu ? event.descriptionRu : event.description;

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={isPast ? "/events/past" : "/events"}
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isPast ? t("backToPast") : t("backToUpcoming")}
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? t("badgePast") : t("badgeUpcoming")}
            </Badge>
            <Badge variant="outline">
              {event.isOnline ? t("online") : t("inPerson")}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
        </div>

        {/* Event Details Card */}
        <Card className="mb-8">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("detailDate")}</p>
                <p className="font-medium">
                  <FormattedEventDate date={event.date} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("detailTime")}</p>
                <p className="font-medium">
                  <FormattedEventTime date={event.date} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {event.isOnline ? (
                  <Video className="h-5 w-5 text-primary" />
                ) : (
                  <MapPin className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("detailLocation")}</p>
                <p className="font-medium">
                  {event.isOnline
                    ? t("virtualEvent")
                    : event.location || t("locationTba")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Description */}
        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">{t("aboutEvent")}</h2>
          <div className="mt-4 whitespace-pre-wrap text-muted-foreground">
            {description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          {isPast ? (
            event.recordingUrl && (
              <Button size="lg" asChild>
                <a
                  href={event.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("watchRecording")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )
          ) : (
            <>
              {event.zoomLink && (
                <Button size="lg" asChild>
                  <a
                    href={event.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("joinEvent")}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Share Section */}
        <div className="mt-12 border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold">{t("shareTitle")}</h3>
          <p className="text-muted-foreground">{t("shareDesc")}</p>
        </div>
      </div>
    </div>
  );
}
