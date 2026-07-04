import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!["ACTIVE", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ id: user.id, status: user.status });
  } catch (error) {
    console.error("Failed to update member status:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}
