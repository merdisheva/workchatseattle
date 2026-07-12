import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MentorRegistrationForm from "@/components/mentors/MentorRegistrationForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MentorForm");
  return {
    title: t("profileTitle"),
  };
}

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
  const [session, t] = await Promise.all([
    auth(),
    getTranslations("MentorForm"),
  ]);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/mentor/profile");
  }

  const mentor = await getMentor(session.user.id);

  if (!mentor) {
    return (
      <div className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("profileTitle")}
          </h1>
          <p className="mt-4 text-muted-foreground">{t("notRegisteredDesc")}</p>
          <Button className="mt-6" asChild>
            <Link href="/mentor/register">{t("becomeMentor")}</Link>
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
            {t("profileTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("profileSubtitle")}</p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t("statusTitle")}
              <Badge variant={mentor.isApproved ? "default" : "secondary"}>
                {mentor.isApproved ? t("statusApproved") : t("statusPending")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mentor.isApproved ? (
              <p className="text-muted-foreground">
                {t("statusApprovedDesc")}{" "}
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="text-primary hover:underline"
                >
                  {t("viewPublicProfile")}
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">{t("statusPendingDesc")}</p>
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
