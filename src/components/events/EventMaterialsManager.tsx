"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, Upload, Loader2 } from "lucide-react";

interface EventMaterial {
  id: string;
  label: string;
  url: string;
  fileType: string;
  size: number;
}

interface EventMaterialsManagerProps {
  eventId: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EventMaterialsManager({
  eventId,
}: EventMaterialsManagerProps) {
  const [materials, setMaterials] = useState<EventMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/materials`);
      if (res.ok) {
        setMaterials(await res.json());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setProgress(0);

    try {
      const pathname = `events/${eventId}/materials/${Date.now()}-${file.name}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: `/api/admin/events/${eventId}/materials/upload`,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });

      const res = await fetch(`/api/admin/events/${eventId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label.trim() || file.name,
          url: blob.url,
          fileType: file.type || "application/octet-stream",
          size: file.size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save material");
      }

      setLabel("");
      setFile(null);
      await loadMaterials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  const handleDelete = async (materialId: string) => {
    setDeletingId(materialId);
    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/materials/${materialId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const isUploading = progress !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Event Materials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Attach slides, handouts, or other files for attendees to download.
          Publicly downloadable once added.
        </p>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading materials...</p>
        ) : materials.length > 0 ? (
          <ul className="space-y-2">
            {materials.map((material) => (
              <li
                key={material.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-medium hover:underline"
                    >
                      {material.label}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(material.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={deletingId === material.id}
                  onClick={() => handleDelete(material.id)}
                  aria-label={`Remove ${material.label}`}
                >
                  {deletingId === material.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No materials added yet.
          </p>
        )}

        <div className="grid gap-3 border-t pt-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="materialLabel">Label</Label>
            <Input
              id="materialLabel"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Slides, Handout"
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialFile">File</Label>
            <Input
              id="materialFile"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading{progress ? ` ${Math.round(progress)}%` : "..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
