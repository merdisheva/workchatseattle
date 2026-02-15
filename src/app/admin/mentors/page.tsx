import { Metadata } from "next";
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
import { MentorApprovalButton } from "./approval-button";

export const metadata: Metadata = {
  title: "Manage Mentors",
};

async function getMentors() {
  const mentors = await prisma.mentor.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      industries: {
        include: { industry: true },
      },
      expertiseAreas: {
        include: { expertiseArea: true },
      },
    },
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
  });
  return mentors;
}

export default async function AdminMentorsPage() {
  const mentors = await getMentors();

  const pendingCount = mentors.filter((m) => !m.isApproved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mentors</h1>
        <p className="mt-1 text-muted-foreground">
          Review and approve mentor applications.
          {pendingCount > 0 && (
            <span className="ml-2 text-secondary">
              ({pendingCount} pending approval)
            </span>
          )}
        </p>
      </div>

      {mentors.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Industries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentors.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="font-medium">
                    {mentor.user.name}
                  </TableCell>
                  <TableCell>{mentor.user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {mentor.industries.slice(0, 2).map(({ industry }) => (
                        <Badge
                          key={industry.name}
                          variant="outline"
                          className="text-xs"
                        >
                          {industry.name}
                        </Badge>
                      ))}
                      {mentor.industries.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.industries.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={mentor.isApproved ? "default" : "secondary"}
                    >
                      {mentor.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(mentor.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <MentorApprovalButton
                      mentorId={mentor.id}
                      isApproved={mentor.isApproved}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-medium">No mentor applications yet</h3>
          <p className="mt-2 text-muted-foreground">
            Mentor applications will appear here for review.
          </p>
        </div>
      )}
    </div>
  );
}
