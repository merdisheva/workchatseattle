import { Metadata } from "next";
import EventForm from "@/components/events/EventForm";

export const metadata: Metadata = {
  title: "Create Event",
};

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <p className="mt-1 text-muted-foreground">
          Add a new event to the calendar.
        </p>
      </div>
      <div className="max-w-2xl">
        <EventForm />
      </div>
    </div>
  );
}
