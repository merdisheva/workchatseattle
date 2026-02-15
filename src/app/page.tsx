import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

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
  const [upcomingEvents, mentorCount] = await Promise.all([
    getUpcomingEvents(),
    getMentorCount(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Women collaborating"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Empower Your Career
              <span className="block text-secondary">Together</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
              A professional network for Russian-speaking women in the Seattle
              area. Join us for knowledge sharing, community building, and
              career development across all industries.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/events">
                  View Upcoming Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/mentors">Find a Mentor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">What We Offer</h2>
            <p className="mt-4 text-muted-foreground">
              Building connections and empowering careers
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
                  alt="Professional event"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Regular Events</h3>
                <p className="text-sm text-muted-foreground">
                  Join our virtual and in-person events covering career growth,
                  leadership, and professional development topics.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80"
                  alt="Mentorship session"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Mentorship</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with experienced professionals who can guide you
                  through your career journey and help you achieve your goals.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
                  alt="Community gathering"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Be part of a supportive community of women who understand your
                  unique challenges and celebrate your successes.
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
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Button variant="ghost" asChild>
                <Link href="/events">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        index === 0
                          ? "1591115765373-5207764f72e7"
                          : index === 1
                          ? "1475721027785-f74eccf877e2"
                          : "1517245386807-bb43f82c33c4"
                      }?w=600&q=80`}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                        {event.isOnline ? "Online" : "In Person"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="mb-2 text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="mb-2 font-semibold">{event.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mentorship CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
            alt="Mentorship"
            fill
            className="object-cover brightness-[0.25]"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Find Your Mentor
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              Connect with {mentorCount > 0 ? `${mentorCount}+` : ""}{" "}
              experienced professionals ready to guide your career journey.
              Get personalized advice, expand your network, and accelerate
              your growth.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/mentors">Browse Mentors</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/mentor/register">Become a Mentor</Link>
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
              <div className="mt-2 text-muted-foreground">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">50+</div>
              <div className="mt-2 text-muted-foreground">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-foreground">{mentorCount || "10"}+</div>
              <div className="mt-2 text-muted-foreground">Active Mentors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Join Our Community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Connect with us on Facebook to stay updated on the latest events,
            discussions, and opportunities.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <a
              href="https://www.facebook.com/groups/workchatseattle"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Facebook Group
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
