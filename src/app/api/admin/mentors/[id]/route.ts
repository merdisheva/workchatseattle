import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const data = await request.json();

    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        isApproved: data.isApproved,
      },
    });

    return NextResponse.json(mentor);
  } catch (error) {
    console.error("Failed to update mentor:", error);
    return NextResponse.json(
      { error: "Failed to update mentor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.mentor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete mentor:", error);
    return NextResponse.json(
      { error: "Failed to delete mentor" },
      { status: 500 }
    );
  }
}
