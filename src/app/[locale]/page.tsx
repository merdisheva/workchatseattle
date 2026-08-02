import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  Calendar,
  Sparkles,
  Heart,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { prisma } from "@/lib/prisma";
import { FormattedEventDate } from "@/components/events/EventDateTime";
import { getTranslations, getLocale } from "next-intl/server";

const HOME_HERO_VIDEO_SRC = "/videos/home-hero-presentation.mp4";

const featuredEventImages = [
  "/images/community/event-workshop.webp",
  "/images/community/event-audience.webp",
  "/images/community/event-networking.webp",
];

const galleryImages = [
  "/images/community/home-hero-roundtable.webp",
  "/images/community/home-events.webp",
  "/images/community/home-mentorship.webp",
  "/images/community/home-community.webp",
  "/images/community/event-workshop.webp",
  "/images/community/event-audience.webp",
  "/images/community/event-networking.webp",
  "/images/community/home-mentor-friends.webp",
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
      <section className="relative -mt-16 flex min-h-screen items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0 motion-reduce:hidden">
          <video
            className="h-full w-full object-cover"
            src={HOME_HERO_VIDEO_SRC}
            poster="/images/community/home-hero-roundtable.webp"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>
        <div className="absolute inset-0 z-0 hidden motion-reduce:block">
          <Image
            src="/images/community/home-hero-roundtable.webp"
            alt="WorkChat Seattle members at a community event"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
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

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">{t("missionTitle")}</h2>
          <p className="mt-4 text-muted-foreground">{t("missionText")}</p>
          <Link
            href="/about"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            {t("missionLearnMore")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
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
                  alt="WorkChat Seattle panel discussion"
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
                  alt="WorkChat Seattle members collaborating"
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
                  alt="WorkChat Seattle community group"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
            src="/images/community/home-mentor-friends.webp"
            alt="Two WorkChat Seattle community members"
            fill
            className="object-cover brightness-[0.45]"
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

      {/* Photo Gallery */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t("galleryTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("gallerySubtitle")}</p>
          </div>
          <Carousel opts={{ loop: true }} className="mx-auto max-w-5xl">
            <CarouselContent>
              {galleryImages.map((src) => (
                <CarouselItem key={src} className="sm:basis-1/2 lg:basis-1/3">
                  <div className="relative h-56 overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt="WorkChat Seattle community photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 sm:-left-12" />
            <CarouselNext className="-right-4 sm:-right-12" />
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t("testimonialsTitle")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("testimonialsSubtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{t(`testimonial${i}Quote`)}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {t(`testimonial${i}Name`).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">
                      {t(`testimonial${i}Name`)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t("waysToHelpTitle")}</h2>
            <p className="mt-4 text-muted-foreground">
              {t("waysToHelpSubtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {t("waysToHelpMentorTitle")}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("waysToHelpMentorDesc")}
                </p>
                <Link
                  href="/mentor/register"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("becomeMentor")}
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {t("waysToHelpEventsTitle")}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("waysToHelpEventsDesc")}
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("waysToHelpEventsLink")}
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Megaphone className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {t("waysToHelpShareTitle")}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("waysToHelpShareDesc")}
                </p>
                <a
                  href="https://www.facebook.com/groups/workchatseattle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("waysToHelpShareLink")}
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Heart className="mx-auto mb-4 h-10 w-10 text-white" />
          <h2 className="text-3xl font-bold text-white">{t("donateTitle")}</h2>
          <p className="mt-4 text-white/90">{t("donateDesc")}</p>
          <Button
            size="lg"
            className="mt-8 bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link href="/contact">{t("donateBtn")}</Link>
          </Button>
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
