import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Past Events",
  description:
    "Watch recordings from past WorkChatSeattle events - career development, networking, and professional growth.",
};

async function getPastEvents() {
  const events = await prisma.event.findMany({
    where: {
      date: {
        lt: new Date(),
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return events;
}

export default async function PastEventsPage() {
  const events = await getPastEvents();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Past Events
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Missed an event? Watch recordings from our past sessions on career
            development, professional growth, and more.
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/events">View Upcoming Events</Link>
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed p-12 text-center">
            <h3 className="text-lg font-medium">No past events yet</h3>
            <p className="mt-2 text-muted-foreground">
              Check out our upcoming events to join the community.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/events">View Upcoming Events</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
