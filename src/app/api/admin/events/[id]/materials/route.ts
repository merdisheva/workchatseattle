import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const materials = await prisma.eventMaterial.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(materials);
}

// Called by the client after a file has been uploaded directly to Vercel
// Blob, to persist the resulting URL as an EventMaterial row. We record the
// material here (rather than relying solely on the onUploadCompleted webhook
// in the upload route) because that webhook can't reach a local dev server.
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  try {
    const data = await request.json();
    const { label, url, fileType, size } = data;

    if (!label || !url || !fileType || typeof size !== "number") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Only allow recording blobs that were actually uploaded for this event.
    if (!url.includes(`/events/${eventId}/materials/`)) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    const material = await prisma.eventMaterial.create({
      data: { eventId, label, url, fileType, size },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("Failed to save event material:", error);
    return NextResponse.json(
      { error: "Failed to save event material" },
      { status: 500 }
    );
  }
}
