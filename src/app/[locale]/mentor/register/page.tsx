import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MentorRegistrationForm from "@/components/mentors/MentorRegistrationForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MentorForm");
  return {
    title: t("registerTitle"),
    description: t("registerDesc"),
  };
}

async function getExistingMentor(userId: string) {
  const mentor = await prisma.mentor.findUnique({
    where: { userId },
  });
  return mentor;
}

export default async function MentorRegisterPage() {
  const [session, t] = await Promise.all([
    auth(),
    getTranslations("MentorForm"),
  ]);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/mentor/register");
  }

  const existingMentor = await getExistingMentor(session.user.id);

  if (existingMentor) {
    redirect("/mentor/profile");
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("registerTitle")}
          </h1>
          <p className="mt-4 text-muted-foreground">{t("registerDesc")}</p>
        </div>

        <MentorRegistrationForm />
      </div>
    </div>
  );
}
