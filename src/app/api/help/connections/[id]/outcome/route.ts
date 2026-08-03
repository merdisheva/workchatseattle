import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id: connectionId } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, rating, isPublic, unpauseOffer, unpauseRequest } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Outcome content is required" }, { status: 400 });
    }

    // Load connection to verify existence and user roles
    const connection = await prisma.helpConnection.findUnique({
      where: { id: connectionId },
      include: {
        request: true,
        offer: true,
      },
    });

    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    if (connection.status !== "ACCEPTED" && connection.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Outcome can only be logged for accepted or active connections" },
        { status: 400 }
      );
    }

    // Verify caller is part of the connection
    let isRequester = false;
    let isHelper = false;

    if (connection.requestId) {
      isRequester = connection.request?.userId === session.user.id;
      isHelper = connection.initiatorId === session.user.id;
    } else if (connection.offerId) {
      isHelper = connection.offer?.userId === session.user.id;
      isRequester = connection.initiatorId === session.user.id;
    }

    if (!isRequester && !isHelper) {
      return NextResponse.json(
        { error: "Forbidden: You are not a participant in this connection" },
        { status: 403 }
      );
    }

    // Save or update the outcome
    const outcome = await prisma.helpOutcome.upsert({
      where: {
        connectionId_userId: {
          connectionId,
          userId: session.user.id,
        },
      },
      update: {
        content,
        rating: rating !== undefined && rating !== null ? parseInt(rating) : undefined,
        isPublic: isPublic ?? false,
      },
      create: {
        connectionId,
        userId: session.user.id,
        content,
        rating: rating !== undefined && rating !== null ? parseInt(rating) : undefined,
        isPublic: isPublic ?? false,
      },
    });

    // Perform unpausing if requested by the respective participant
    if (isRequester && unpauseRequest && connection.requestId) {
      await prisma.helpRequest.update({
        where: { id: connection.requestId },
        data: { status: "OPEN" },
      });
    }
    if (isHelper && unpauseOffer && connection.offerId) {
      await prisma.helpOffer.update({
        where: { id: connection.offerId },
        data: { status: "OPEN" },
      });
    }

    // Check if both sides have submitted outcomes
    const outcomes = await prisma.helpOutcome.findMany({
      where: { connectionId },
    });

    if (outcomes.length === 2 && connection.status !== "COMPLETED") {
      await prisma.helpConnection.update({
        where: { id: connectionId },
        data: { status: "COMPLETED" },
      });
    }

    return NextResponse.json(outcome);
  } catch (error) {
    console.error("Failed to log outcome:", error);
    return NextResponse.json(
      { error: "Failed to log outcome" },
      { status: 500 }
    );
  }
}
