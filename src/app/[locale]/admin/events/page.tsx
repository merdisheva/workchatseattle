import { Metadata } from "next";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteEventButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Events",
};

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
  });
  return events;
}

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="mt-1 text-muted-foreground">
            Manage upcoming and past events.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const isPast = new Date(event.date) < new Date();
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {event.isOnline ? "Online" : "In Person"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPast ? "secondary" : "default"}>
                        {isPast ? "Past" : "Upcoming"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.recordingUrl ? (
                        <Badge variant="outline" className="text-green-600">
                          Available
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteEventButton eventId={event.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-medium">No events yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first event to get started.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/admin/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
