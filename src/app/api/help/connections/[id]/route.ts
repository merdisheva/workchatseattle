import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connection = await prisma.helpConnection.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        offer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        outcomes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    // Verify user is part of the connection
    if (
      connection.request.userId !== session.user.id &&
      connection.offer.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden: You are not part of this connection" }, { status: 403 });
    }

    return NextResponse.json(connection);
  } catch (error) {
    console.error("Failed to fetch connection:", error);
    return NextResponse.json(
      { error: "Failed to fetch connection" },
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
    const connection = await prisma.helpConnection.findUnique({
      where: { id },
      include: {
        request: true,
        offer: true,
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    // Verify user is part of the connection
    if (
      connection.request.userId !== session.user.id &&
      connection.offer.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Update connection status
    const updatedConnection = await prisma.helpConnection.update({
      where: { id },
      data: { status },
    });

    // Side-effects: if connection is accepted, we update underlying request/offer status to CONNECTED
    if (status === "ACCEPTED") {
      await Promise.all([
        prisma.helpRequest.update({
          where: { id: connection.requestId },
          data: { status: "CONNECTED" },
        }),
        prisma.helpOffer.update({
          where: { id: connection.offerId },
          data: { status: "CONNECTED" },
        }),
      ]);
    } else if (status === "CANCELLED" || status === "DECLINED") {
      // Revert underlying request/offer back to OPEN if they were in CONNECTED status
      if (connection.request.status === "CONNECTED") {
        await prisma.helpRequest.update({
          where: { id: connection.requestId },
          data: { status: "OPEN" },
        });
      }
      if (connection.offer.status === "CONNECTED") {
        await prisma.helpOffer.update({
          where: { id: connection.offerId },
          data: { status: "OPEN" },
        });
      }
    }

    return NextResponse.json(updatedConnection);
  } catch (error) {
    console.error("Failed to update connection status:", error);
    return NextResponse.json(
      { error: "Failed to update connection" },
      { status: 500 }
    );
  }
}
