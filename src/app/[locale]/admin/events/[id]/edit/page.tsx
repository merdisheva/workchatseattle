import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/events/EventForm";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Event",
};

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  return event;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="mt-1 text-muted-foreground">
          Update event details.
        </p>
      </div>
      <div className="max-w-2xl">
        <EventForm event={event} />
      </div>
    </div>
  );
}
