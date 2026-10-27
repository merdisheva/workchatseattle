import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEditableMentor } from "@/lib/mentor-photo-server";
import {
  isBlobUrl,
  mentorPhotoPathPrefix,
} from "@/lib/mentor-photo";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function deleteOldPhoto(url: string | null) {
  if (!url || !isBlobUrl(url)) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete old mentor photo blob:", error);
    // The user record is still updated even if the old blob is already gone.
  }
}

// Called by the client after the photo has been uploaded directly to Vercel
// Blob, to save the resulting URL as the mentor's profile photo.
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  const { id: mentorId } = await params;

  const mentor = await getEditableMentor(session, mentorId);
  if (!mentor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();

    // Only allow photos that were actually uploaded for this mentor.
    if (
      typeof url !== "string" ||
      !isBlobUrl(url) ||
      !new URL(url).pathname.startsWith(`/${mentorPhotoPathPrefix(mentorId)}`)
    ) {
      return NextResponse.json({ error: "Invalid photo URL" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: mentor.userId },
      data: { image: url },
    });

    if (mentor.user.image !== url) {
      await deleteOldPhoto(mentor.user.image);
    }

    return NextResponse.json({ image: url });
  } catch (error) {
    console.error("Failed to save mentor photo:", error);
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  const { id: mentorId } = await params;

  const mentor = await getEditableMentor(session, mentorId);
  if (!mentor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: mentor.userId },
    data: { image: null },
  });

  await deleteOldPhoto(mentor.user.image);

  return NextResponse.json({ success: true });
}
