import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, whereDoYouLive, howDidYouHear, whatDoYouExpect } =
      await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!whereDoYouLive || !howDidYouHear || !whatDoYouExpect) {
      return NextResponse.json(
        { error: "Please answer all screening questions" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const adminUser = isAdmin(email);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: adminUser ? "ADMIN" : "USER",
        status: adminUser ? "ACTIVE" : "PENDING",
        application: adminUser
          ? undefined
          : {
              create: { whereDoYouLive, howDidYouHear, whatDoYouExpect },
            },
      },
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
