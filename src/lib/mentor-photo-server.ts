import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

// Returns the mentor if the current user may change its photo: admins can
// edit any mentor, mentors can edit only their own profile.
export async function getEditableMentor(
  session: Session | null,
  mentorId: string
) {
  if (!session) return null;

  const mentor = await prisma.mentor.findUnique({
    where: { id: mentorId },
    include: { user: { select: { id: true, image: true } } },
  });

  if (!mentor) return null;
  if (session.user.role !== "ADMIN" && mentor.userId !== session.user.id) {
    return null;
  }

  return mentor;
}
