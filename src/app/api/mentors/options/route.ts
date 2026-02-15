import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [industries, expertiseAreas] = await Promise.all([
    prisma.industry.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.expertiseArea.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({ industries, expertiseAreas });
}
