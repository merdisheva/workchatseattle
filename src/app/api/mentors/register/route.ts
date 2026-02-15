import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingMentor = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
  });

  if (existingMentor) {
    return NextResponse.json(
      { error: "You are already registered as a mentor" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();

    const mentor = await prisma.mentor.create({
      data: {
        userId: session.user.id,
        bio: data.bio,
        linkedInUrl: data.linkedInUrl,
        contactEmail: data.contactEmail,
        isApproved: false,
        industries: {
          create: data.industryIds.map((industryId: string) => ({
            industryId,
          })),
        },
        expertiseAreas: {
          create: data.expertiseAreaIds.map((expertiseAreaId: string) => ({
            expertiseAreaId,
          })),
        },
      },
    });

    return NextResponse.json(mentor);
  } catch (error) {
    console.error("Failed to register mentor:", error);
    return NextResponse.json(
      { error: "Failed to register as mentor" },
      { status: 500 }
    );
  }
}
