import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
  });

  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        isOnline: data.isOnline,
        zoomLink: data.zoomLink,
        location: data.location,
        recordingUrl: data.recordingUrl,
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
