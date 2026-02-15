"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    description: string;
    date: Date;
    isOnline: boolean;
    zoomLink?: string | null;
    location?: string | null;
    recordingUrl?: string | null;
    imageUrl?: string | null;
  };
}

export default function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(
    event?.date
      ? new Date(event.date).toISOString().slice(0, 16)
      : ""
  );
  const [isOnline, setIsOnline] = useState(event?.isOnline ?? true);
  const [zoomLink, setZoomLink] = useState(event?.zoomLink || "");
  const [location, setLocation] = useState(event?.location || "");
  const [recordingUrl, setRecordingUrl] = useState(event?.recordingUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/events/${event.id}`
        : "/api/admin/events";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date: new Date(date).toISOString(),
          isOnline,
          zoomLink: isOnline ? zoomLink : null,
          location: !isOnline ? location : null,
          recordingUrl: recordingUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Event" : "Create Event"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Career Growth Strategies Workshop"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event, topics covered, and what attendees will learn..."
              rows={5}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select
                value={isOnline ? "online" : "inperson"}
                onValueChange={(value) => setIsOnline(value === "online")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online (Virtual)</SelectItem>
                  <SelectItem value="inperson">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isOnline ? (
            <div className="space-y-2">
              <Label htmlFor="zoomLink">Zoom/Meeting Link</Label>
              <Input
                id="zoomLink"
                type="url"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Seattle, WA or specific venue"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="recordingUrl">Recording URL (for past events)</Label>
            <Input
              id="recordingUrl"
              type="url"
              value={recordingUrl}
              onChange={(e) => setRecordingUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Create Event"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
