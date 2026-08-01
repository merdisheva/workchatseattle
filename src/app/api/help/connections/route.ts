import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connections = await prisma.helpConnection.findMany({
      where: {
        OR: [
          { request: { userId: session.user.id } },
          { offer: { userId: session.user.id } },
        ],
      },
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
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error("Failed to fetch connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Unauthorized: Only approved members can make connections" },
      { status: 401 }
    );
  }

  try {
    const { requestId, offerId, message } = await request.json();

    if (!requestId || !offerId) {
      return NextResponse.json(
        { error: "requestId and offerId are required" },
        { status: 400 }
      );
    }

    // Load request and offer to verify ownership and existence
    const [helpRequest, helpOffer] = await Promise.all([
      prisma.helpRequest.findUnique({ where: { id: requestId } }),
      prisma.helpOffer.findUnique({ where: { id: offerId } }),
    ]);

    if (!helpRequest || !helpOffer) {
      return NextResponse.json(
        { error: "Help request or help offer not found" },
        { status: 404 }
      );
    }

    if (helpRequest.status === "PAUSED" || helpOffer.status === "PAUSED") {
      return NextResponse.json(
        { error: "Cannot connect: This post is paused" },
        { status: 400 }
      );
    }

    // Verify caller is one of the parties
    if (helpRequest.userId !== session.user.id && helpOffer.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You must own either the request or the offer to propose a connection" },
        { status: 403 }
      );
    }

    // Check for existing connection between this request and offer
    const existingConnection = await prisma.helpConnection.findUnique({
      where: {
        requestId_offerId: {
          requestId,
          offerId,
        },
      },
    });

    if (existingConnection) {
      return NextResponse.json(existingConnection);
    }

    // Create the connection (status is PENDING by default)
    const connection = await prisma.helpConnection.create({
      data: {
        requestId,
        offerId,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json(connection);
  } catch (error) {
    console.error("Failed to propose connection:", error);
    return NextResponse.json(
      { error: "Failed to propose connection" },
      { status: 500 }
    );
  }
}
