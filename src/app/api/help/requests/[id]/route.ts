import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const helpRequest = await prisma.helpRequest.findUnique({
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

    if (!helpRequest) {
      return NextResponse.json({ error: "Help request not found" }, { status: 404 });
    }

    return NextResponse.json(helpRequest);
  } catch (error) {
    console.error("Failed to fetch help request:", error);
    return NextResponse.json(
      { error: "Failed to fetch help request" },
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
    const existingRequest = await prisma.helpRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Help request not found" }, { status: 404 });
    }

    if (existingRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this post" }, { status: 403 });
    }

    const { title, description, status } = await request.json();

    const updatedRequest = await prisma.helpRequest.update({
      where: { id },
      data: {
        title: title ?? existingRequest.title,
        description: description ?? existingRequest.description,
        status: status ?? existingRequest.status,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Failed to update help request:", error);
    return NextResponse.json(
      { error: "Failed to update help request" },
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
    const existingRequest = await prisma.helpRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Help request not found" }, { status: 404 });
    }

    if (existingRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this post" }, { status: 403 });
    }

    // Soft delete by marking as CANCELLED
    const cancelledRequest = await prisma.helpRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(cancelledRequest);
  } catch (error) {
    console.error("Failed to delete help request:", error);
    return NextResponse.json(
      { error: "Failed to delete help request" },
      { status: 500 }
    );
  }
}
