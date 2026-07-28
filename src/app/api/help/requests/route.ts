import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    } else {
      // General feed excludes completed and cancelled requests
      whereClause.status = "OPEN";
    }

    const requests = await prisma.helpRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch help requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch help requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Unauthorized: Only approved members can create help requests" },
      { status: 401 }
    );
  }

  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const helpRequest = await prisma.helpRequest.create({
      data: {
        userId: session.user.id,
        title,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json(helpRequest);
  } catch (error) {
    console.error("Failed to create help request:", error);
    return NextResponse.json(
      { error: "Failed to create help request" },
      { status: 500 }
    );
  }
}
