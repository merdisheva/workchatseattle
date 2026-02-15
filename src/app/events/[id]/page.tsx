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

interface EventPageProps {
  params: Promise<{
    id: string;
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
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.title,
    description: event.description.substring(0, 160),
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date) < new Date();

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={isPast ? "/events/past" : "/events"}
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {isPast ? "Past" : "Upcoming"} Events
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Past Event" : "Upcoming"}
            </Badge>
            <Badge variant="outline">
              {event.isOnline ? "Online" : "In Person"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {event.title}
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
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{formattedTime}</p>
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
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {event.isOnline ? "Virtual Event" : event.location || "TBA"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Description */}
        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">About This Event</h2>
          <div className="mt-4 whitespace-pre-wrap text-muted-foreground">
            {event.description}
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
                  Watch Recording
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
                    Join Event
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Share Section */}
        <div className="mt-12 border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold">Share This Event</h3>
          <p className="text-muted-foreground">
            Know someone who might be interested? Share this event with your
            network.
          </p>
        </div>
      </div>
    </div>
  );
}
