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
          { initiatorId: session.user.id },
          { request: { userId: session.user.id } },
          { offer: { userId: session.user.id } },
        ],
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
    const { requestId, offerId, message, contact } = await request.json();

    if (!requestId && !offerId) {
      return NextResponse.json(
        { error: "requestId or offerId is required" },
        { status: 400 }
      );
    }

    if (!contact || typeof contact !== "string" || !contact.trim()) {
      return NextResponse.json(
        { error: "Contact information is required to propose a connection" },
        { status: 400 }
      );
    }

    if (requestId) {
      const helpRequest = await prisma.helpRequest.findUnique({ where: { id: requestId } });
      if (!helpRequest) {
        return NextResponse.json({ error: "Help request not found" }, { status: 404 });
      }
      if (helpRequest.status === "PAUSED") {
        return NextResponse.json({ error: "Cannot connect: This post is paused" }, { status: 400 });
      }
      if (helpRequest.userId === session.user.id) {
        return NextResponse.json({ error: "Forbidden: You cannot connect to your own request" }, { status: 403 });
      }

      // Check unique constraint for initiator + requestId
      const existingConnection = await prisma.helpConnection.findUnique({
        where: {
          requestId_initiatorId: {
            requestId,
            initiatorId: session.user.id,
          },
        },
      });
      if (existingConnection) {
        return NextResponse.json(existingConnection);
      }

      const connection = await prisma.helpConnection.create({
        data: {
          requestId,
          initiatorId: session.user.id,
          initiatorContact: contact.trim(),
          message,
          status: "PENDING",
        },
      });
      return NextResponse.json(connection);
    } else {
      const helpOffer = await prisma.helpOffer.findUnique({ where: { id: offerId } });
      if (!helpOffer) {
        return NextResponse.json({ error: "Help offer not found" }, { status: 404 });
      }
      if (helpOffer.status === "PAUSED") {
        return NextResponse.json({ error: "Cannot connect: This post is paused" }, { status: 400 });
      }
      if (helpOffer.userId === session.user.id) {
        return NextResponse.json({ error: "Forbidden: You cannot connect to your own offer" }, { status: 403 });
      }

      // Check unique constraint for initiator + offerId
      const existingConnection = await prisma.helpConnection.findUnique({
        where: {
          offerId_initiatorId: {
            offerId,
            initiatorId: session.user.id,
          },
        },
      });
      if (existingConnection) {
        return NextResponse.json(existingConnection);
      }

      const connection = await prisma.helpConnection.create({
        data: {
          offerId,
          initiatorId: session.user.id,
          initiatorContact: contact.trim(),
          message,
          status: "PENDING",
        },
      });
      return NextResponse.json(connection);
    }
  } catch (error) {
    console.error("Failed to propose connection:", error);
    return NextResponse.json(
      { error: "Failed to propose connection" },
      { status: 500 }
    );
  }
}
