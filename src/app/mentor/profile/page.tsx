import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MentorRegistrationForm from "@/components/mentors/MentorRegistrationForm";

export const metadata: Metadata = {
  title: "Mentor Profile",
};

async function getMentor(userId: string) {
  const mentor = await prisma.mentor.findUnique({
    where: { userId },
    include: {
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

export default async function MentorProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/mentor/profile");
  }

  const mentor = await getMentor(session.user.id);

  if (!mentor) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Mentor Profile
          </h1>
          <p className="mt-4 text-muted-foreground">
            You haven&apos;t registered as a mentor yet.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/mentor/register">Become a Mentor</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Mentor Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your mentor profile and visibility.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile Status
              <Badge variant={mentor.isApproved ? "default" : "secondary"}>
                {mentor.isApproved ? "Approved" : "Pending Review"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mentor.isApproved ? (
              <p className="text-muted-foreground">
                Your mentor profile is live and visible to the community.{" "}
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="text-primary hover:underline"
                >
                  View public profile
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Your profile is pending admin approval. You&apos;ll be notified
                once it&apos;s reviewed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <MentorRegistrationForm
          existingMentor={{
            id: mentor.id,
            bio: mentor.bio,
            linkedInUrl: mentor.linkedInUrl,
            contactEmail: mentor.contactEmail,
            industries: mentor.industries.map((i) => ({
              industryId: i.industryId,
            })),
            expertiseAreas: mentor.expertiseAreas.map((e) => ({
              expertiseAreaId: e.expertiseAreaId,
            })),
          }}
        />
      </div>
    </div>
  );
}
