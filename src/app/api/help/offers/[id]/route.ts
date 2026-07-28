import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const helpOffer = await prisma.helpOffer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!helpOffer) {
      return NextResponse.json({ error: "Help offer not found" }, { status: 404 });
    }

    return NextResponse.json(helpOffer);
  } catch (error) {
    console.error("Failed to fetch help offer:", error);
    return NextResponse.json(
      { error: "Failed to fetch help offer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingOffer = await prisma.helpOffer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return NextResponse.json({ error: "Help offer not found" }, { status: 404 });
    }

    if (existingOffer.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this post" }, { status: 403 });
    }

    const { title, description, status } = await request.json();

    const updatedOffer = await prisma.helpOffer.update({
      where: { id },
      data: {
        title: title ?? existingOffer.title,
        description: description ?? existingOffer.description,
        status: status ?? existingOffer.status,
      },
    });

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("Failed to update help offer:", error);
    return NextResponse.json(
      { error: "Failed to update help offer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingOffer = await prisma.helpOffer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return NextResponse.json({ error: "Help offer not found" }, { status: 404 });
    }

    if (existingOffer.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this post" }, { status: 403 });
    }

    // Soft delete by marking as CANCELLED
    const cancelledOffer = await prisma.helpOffer.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(cancelledOffer);
  } catch (error) {
    console.error("Failed to delete help offer:", error);
    return NextResponse.json(
      { error: "Failed to delete help offer" },
      { status: 500 }
    );
  }
}
