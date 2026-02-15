import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mentor = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
    include: {
      industries: {
        include: { industry: true },
      },
      expertiseAreas: {
        include: { expertiseArea: true },
      },
    },
  });

  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
  }

  return NextResponse.json(mentor);
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingMentor = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
  });

  if (!existingMentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
  }

  try {
    const data = await request.json();

    // Delete existing relations
    await prisma.mentorIndustry.deleteMany({
      where: { mentorId: existingMentor.id },
    });
    await prisma.mentorExpertise.deleteMany({
      where: { mentorId: existingMentor.id },
    });

    // Update mentor with new data
    const mentor = await prisma.mentor.update({
      where: { id: existingMentor.id },
      data: {
        bio: data.bio,
        linkedInUrl: data.linkedInUrl,
        contactEmail: data.contactEmail,
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
    console.error("Failed to update mentor:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
