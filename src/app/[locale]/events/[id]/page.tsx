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
  Lock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

function parseVideoUrl(urlStr: string) {
  const url = urlStr.trim();
  let cleanUrl = url;
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = "https://" + cleanUrl;
  }
  try {
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase();

    // YouTube
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      let videoId = "";
      if (host.includes("youtu.be")) {
        videoId = parsed.pathname.substring(1);
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2];
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/")[2];
      } else {
        videoId = parsed.searchParams.get("v") || "";
      }
      videoId = videoId.split("&")[0];
      if (videoId) {
        return {
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    // Vimeo
    if (host.includes("vimeo.com")) {
      let videoId = "";
      if (host.includes("player.vimeo.com")) {
        const parts = parsed.pathname.split("/");
        videoId = parts[parts.length - 1];
      } else {
        const parts = parsed.pathname.split("/");
        videoId = parts[parts.length - 1];
      }
      if (videoId && /^\d+$/.test(videoId)) {
        return {
          type: "vimeo",
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    // Loom
    if (host.includes("loom.com")) {
      let videoId = "";
      const parts = parsed.pathname.split("/");
      videoId = parts[parts.length - 1];
      if (videoId) {
        return {
          type: "loom",
          embedUrl: `https://www.loom.com/embed/${videoId}`,
        };
      }
    }

    // Direct Video Link (HTML5 Video)
    if (/\.(mp4|webm|ogg|ogv)(\?.*)?$/i.test(parsed.pathname)) {
      return {
        type: "direct",
        embedUrl: url,
      };
    }
  } catch (e) {
    // Ignore URL parse error
  }
  return {
    type: "unknown",
    embedUrl: url,
  };
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
  const [event, t, session] = await Promise.all([
    getEvent(id),
    getTranslations("Events"),
    auth(),
  ]);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date) < new Date();
  const isApproved =
    session?.user?.status === "ACTIVE" || session?.user?.role === "ADMIN";

  const title = locale === "ru" && event.titleRu ? event.titleRu : event.title;
  const description = locale === "ru" && event.descriptionRu ? event.descriptionRu : event.description;
  const videoInfo = event.recordingUrl ? parseVideoUrl(event.recordingUrl) : null;

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

        {/* Video Embedding */}
        {event.recordingUrl && videoInfo && (
          <div className="mt-12 border-t pt-8">
            <h2 className="mb-6 text-xl font-semibold flex items-center gap-2 text-foreground">
              <Video className="h-5 w-5 text-primary" />
              {t("videoRecording")}
            </h2>
            
            {isApproved ? (
              videoInfo.type !== "unknown" ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10 dark:border-white/5 bg-black group hover:shadow-2xl transition-all duration-300">
                  {videoInfo.type === "direct" ? (
                    <video 
                      src={videoInfo.embedUrl} 
                      controls 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <iframe
                      src={videoInfo.embedUrl}
                      title="Event Recording"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-gradient-to-br from-muted/50 to-muted p-8 text-center sm:p-12 hover:border-primary/50 transition-colors duration-300">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Video className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("watchRecording")}
                  </h3>
                  <p className="mx-auto max-w-md text-sm text-muted-foreground mb-6">
                    {t("externalVideoDesc")}
                  </p>
                  <Button size="lg" asChild className="shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    <a
                      href={event.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("watchRecording")}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )
            ) : !session ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-muted/40 to-muted p-8 text-center sm:p-12 shadow-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
                  <Lock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t("videoLockedTitle")}
                </h3>
                <p className="mx-auto max-w-lg text-sm text-muted-foreground mb-6">
                  {t("videoLockedDesc")}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" asChild className="shadow-md">
                    <Link href={`/auth/signin?callbackUrl=/events/${event.id}`}>
                      {t("signInToWatch")}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/signup">
                      {t("signUpToWatch")}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-muted/40 to-muted p-8 text-center sm:p-12 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 ring-8 ring-amber-500/5">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t("videoPendingTitle")}
                </h3>
                <p className="mx-auto max-w-lg text-sm text-muted-foreground mb-6">
                  {t("videoPendingDesc")}
                </p>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/pending">
                    {t("videoPendingTitle")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          {isPast ? (
            event.recordingUrl && isApproved && (
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
