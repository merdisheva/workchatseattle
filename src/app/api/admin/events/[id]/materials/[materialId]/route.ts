import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
    materialId: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId, materialId } = await params;

  const material = await prisma.eventMaterial.findUnique({
    where: { id: materialId },
  });

  if (!material || material.eventId !== eventId) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  try {
    await del(material.url);
  } catch (error) {
    console.error("Failed to delete blob for event material:", error);
    // Continue removing the DB record even if the blob is already gone.
  }

  await prisma.eventMaterial.delete({ where: { id: materialId } });

  return NextResponse.json({ success: true });
}
