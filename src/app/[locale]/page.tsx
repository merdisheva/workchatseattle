import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ArrowRight, Users, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { FormattedEventDate } from "@/components/events/EventDateTime";
import { getTranslations, getLocale } from "next-intl/server";

const featuredEventImages = [
  "/images/community/event-workshop.webp",
  "/images/community/event-audience.webp",
  "/images/community/event-networking.webp",
];

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
    take: 3,
  });
  return events;
}

async function getMentorCount() {
  const count = await prisma.mentor.count({
    where: {
      isApproved: true,
    },
  });
  return count;
}

export default async function HomePage() {
  const [upcomingEvents, mentorCount, tHero, t, locale] = await Promise.all([
    getUpcomingEvents(),
    getMentorCount(),
    getTranslations("Hero"),
    getTranslations("Home"),
    getLocale(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community/home-hero.webp"
            alt="Work Chat Seattle members at a community event"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {tHero("title")}
              <span className="block text-accent">{tHero("subtitle")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
              {tHero("description")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/events">
                  {tHero("upcomingEventsBtn")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/mentors">{tHero("findMentorBtn")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t("featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("featuresSubtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/community/home-events.webp"
                  alt="Work Chat Seattle panel discussion"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("eventsTitle")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("eventsDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/community/home-mentorship.webp"
                  alt="Work Chat Seattle members collaborating"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("mentorshipTitle")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("mentorshipDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/community/home-community.webp"
                  alt="Work Chat Seattle community group"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t("communityTitle")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("communityDesc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("upcomingEventsTitle")}</h2>
              <Button variant="ghost" className="text-foreground" asChild>
                <Link href="/events">
                  {t("viewAll")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={featuredEventImages[index]}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                        {event.isOnline ? t("online") : t("inPerson")}
                      </span>
                    </div>
                  </div>
                   <CardContent className="p-6">
                    <p className="mb-2 text-xs text-muted-foreground">
                      <FormattedEventDate date={event.date} />
                    </p>
                    <h3 className="mb-2 font-semibold">
                      {locale === "ru" && event.titleRu ? event.titleRu : event.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {locale === "ru" && event.descriptionRu ? event.descriptionRu : event.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event.id}`}>{t("learnMore")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mentorship CTA Section */}
      <section className="relative py-20 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community/home-cta.webp"
            alt="Work Chat Seattle members"
            fill
            className="object-cover brightness-[0.25]"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              {mentorCount > 0
                ? t("ctaDescWithCount", { count: `${mentorCount}+` })
                : t("ctaDescNoCount")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/mentors">{t("browseMentors")}</Link>
              </Button>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/mentor/register">{t("becomeMentor")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="mt-2 text-muted-foreground">{t("statsMembers")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">50+</div>
              <div className="mt-2 text-muted-foreground">{t("statsEvents")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-foreground">{mentorCount || "10"}+</div>
              <div className="mt-2 text-muted-foreground">{t("statsMentors")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">{t("joinTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("joinDesc")}
          </p>
          <Button size="lg" className="mt-6" asChild>
            <a
              href="https://www.facebook.com/groups/workchatseattle"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("joinBtn")}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
