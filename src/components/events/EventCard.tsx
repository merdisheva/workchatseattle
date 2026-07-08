import Link from "next/link";
import { Calendar, MapPin, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedEventDate, FormattedEventTime } from "./EventDateTime";

interface Event {
  id: string;
  title: string;
  description: string;
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
  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? "Past Event" : "Upcoming"}
          </Badge>
          <Badge variant="outline">
            {event.isOnline ? "Online" : "In Person"}
          </Badge>
        </div>

        <h3 className="mb-2 text-lg font-semibold">{event.title}</h3>

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
              <span>Virtual Event</span>
            </div>
          ) : event.location ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          ) : null}
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          {isPast && event.recordingUrl && (
            <Button size="sm" asChild>
              <a
                href={event.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Recording
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
