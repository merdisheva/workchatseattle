import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Users, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function getStats() {
  const [totalEvents, upcomingEvents, totalMentors, pendingMentors] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({
        where: {
          date: {
            gte: new Date(),
          },
        },
      }),
      prisma.mentor.count({
        where: {
          isApproved: true,
        },
      }),
      prisma.mentor.count({
        where: {
          isApproved: false,
        },
      }),
    ]);

  return { totalEvents, upcomingEvents, totalMentors, pendingMentors };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome to the WorkChatSeattle admin panel.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingEvents} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Mentors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMentors}</div>
            <p className="text-xs text-muted-foreground">Active mentors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMentors}</div>
            <p className="text-xs text-muted-foreground">
              Mentor applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link href="/admin/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/events">Manage Events</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentors</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link href="/admin/mentors">
                Review Applications
                {stats.pendingMentors > 0 && (
                  <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {stats.pendingMentors}
                  </span>
                )}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
