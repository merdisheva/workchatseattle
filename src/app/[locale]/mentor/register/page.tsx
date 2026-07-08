import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MentorRegistrationForm from "@/components/mentors/MentorRegistrationForm";

export const metadata: Metadata = {
  title: "Become a Mentor",
  description:
    "Register as a mentor in the WorkChatSeattle community and help others grow.",
};

async function getExistingMentor(userId: string) {
  const mentor = await prisma.mentor.findUnique({
    where: { userId },
  });
  return mentor;
}

export default async function MentorRegisterPage() {
  const session = await auth();

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
            Become a Mentor
          </h1>
          <p className="mt-4 text-muted-foreground">
            Share your knowledge and experience with others in the community.
            Fill out the form below to apply as a mentor.
          </p>
        </div>

        <MentorRegistrationForm />
      </div>
    </div>
  );
}
