import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Events");
  return {
    title: t("upcomingTitle"),
    description: t("upcomingDesc"),
  };
}

async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  return events;
}

export default async function EventsPage() {
  const [events, t] = await Promise.all([
    getUpcomingEvents(),
    getTranslations("Events"),
  ]);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t("upcomingTitle")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {t("upcomingDesc")}
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/events/past">{t("viewPastEvents")}</Link>
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed p-12 text-center">
            <h3 className="text-lg font-medium">{t("noUpcomingTitle")}</h3>
            <p className="mt-2 text-muted-foreground">
              {t("noUpcomingDesc")}
            </p>
            <Button className="mt-6" asChild>
              <Link href="/events/past">{t("browsePastEvents")}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
