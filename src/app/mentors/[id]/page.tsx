import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Linkedin, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MentorPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getMentor(id: string) {
  const mentor = await prisma.mentor.findUnique({
    where: { id, isApproved: true },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      industries: {
        include: {
          industry: true,
        },
      },
      expertiseAreas: {
        include: {
          expertiseArea: true,
        },
      },
    },
  });
  return mentor;
}

export async function generateMetadata({
  params,
}: MentorPageProps): Promise<Metadata> {
  const { id } = await params;
  const mentor = await getMentor(id);

  if (!mentor) {
    return {
      title: "Mentor Not Found",
    };
  }

  return {
    title: `${mentor.user.name} - Mentor`,
    description: mentor.bio.substring(0, 160),
  };
}

export default async function MentorPage({ params }: MentorPageProps) {
  const { id } = await params;
  const mentor = await getMentor(id);

  if (!mentor) {
    notFound();
  }

  const initials = mentor.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "M";

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/mentors"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mentors
        </Link>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={mentor.user.image || undefined}
                  alt={mentor.user.name || "Mentor"}
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{mentor.user.name}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentor.industries.map(({ industry }) => (
                    <Badge key={industry.name} variant="secondary">
                      {industry.name}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.linkedInUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={mentor.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  <Button size="sm" asChild>
                    <a href={`mailto:${mentor.contactEmail}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-muted-foreground">
              {mentor.bio}
            </div>
          </CardContent>
        </Card>

        {/* Expertise */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Areas of Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mentor.expertiseAreas.map(({ expertiseArea }) => (
                <Badge key={expertiseArea.name} variant="outline">
                  {expertiseArea.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold">
              Interested in connecting?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Reach out to {mentor.user.name} to start a conversation about
              mentorship.
            </p>
            <Button className="mt-4" asChild>
              <a href={`mailto:${mentor.contactEmail}`}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
