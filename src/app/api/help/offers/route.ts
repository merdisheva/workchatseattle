import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const whereClause: any = {
      status: { in: ["OPEN", "PAUSED"] }
    };
    
    if (userId) {
      whereClause.userId = userId;
    }

    const offers = await prisma.helpOffer.findMany({
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
      orderBy: [
        { status: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Failed to fetch help offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch help offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Unauthorized: Only approved members can create help offers" },
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

    const helpOffer = await prisma.helpOffer.create({
      data: {
        userId: session.user.id,
        title,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json(helpOffer);
  } catch (error) {
    console.error("Failed to create help offer:", error);
    return NextResponse.json(
      { error: "Failed to create help offer" },
      { status: 500 }
    );
  }
}
