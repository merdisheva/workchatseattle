import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberActionButtons } from "./action-buttons";

export const metadata: Metadata = { title: "Manage Members" };
export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
};

async function getMembers() {
  return prisma.user.findMany({
    where: { role: "USER" },
    include: { application: true },
    orderBy: [
      // PENDING first
      { status: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export default async function AdminMembersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/auth/signin");

  const members = await getMembers();
  const pendingCount = members.filter((m) => m.status === "PENDING").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="mt-1 text-muted-foreground">
          Review and approve member applications.
          {pendingCount > 0 && (
            <span className="ml-2 text-secondary">
              ({pendingCount} pending approval)
            </span>
          )}
        </p>
      </div>

      {members.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-medium">No members yet</h3>
          <p className="mt-2 text-muted-foreground">
            Member applications will appear here for review.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Where they live</TableHead>
                <TableHead>How they heard</TableHead>
                <TableHead>What they expect</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name ?? "—"}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[member.status] ?? "outline"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate">
                    {member.application?.whereDoYouLive ?? <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate">
                    {member.application?.howDidYouHear ?? <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="line-clamp-2 text-sm">
                      {member.application?.whatDoYouExpect ?? <span className="text-muted-foreground">N/A</span>}
                    </p>
                  </TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <MemberActionButtons userId={member.id} status={member.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
