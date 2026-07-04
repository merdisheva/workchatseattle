import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Rejected users cannot sign in
        if (user.status === "REJECTED") {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth sign-ins, set new users to PENDING unless they're admins
      if (account?.provider === "google" && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { status: true, createdAt: true },
        });
        // Newly created OAuth users have ACTIVE status (schema default) — set to PENDING
        // unless they're an admin email. We detect "new" by checking if createdAt is very recent.
        if (dbUser && dbUser.status === "ACTIVE" && !isAdmin(user.email)) {
          const isNewUser = Date.now() - new Date(dbUser.createdAt).getTime() < 10_000;
          if (isNewUser) {
            await prisma.user.update({
              where: { email: user.email },
              data: { status: "PENDING" },
            });
          }
        }
        // Block rejected users from signing in via OAuth
        if (dbUser?.status === "REJECTED") {
          return "/auth/rejected";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, email: true, status: true },
        });
        const adminOverride = isAdmin(dbUser?.email ?? "");
        const role = dbUser?.role === "ADMIN" || adminOverride ? "ADMIN" : "USER";
        // Admin emails are always ACTIVE
        const status = adminOverride ? "ACTIVE" : (dbUser?.status ?? "PENDING");
        token.role = role;
        token.status = status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.status = token.status as "PENDING" | "ACTIVE" | "REJECTED";
      }
      return session;
    },
  },
});

export function isAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
    e.trim().toLowerCase()
  );
  return adminEmails?.includes(email.toLowerCase()) || false;
}
