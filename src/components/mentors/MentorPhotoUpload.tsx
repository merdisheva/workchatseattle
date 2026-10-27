"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useTranslations } from "next-intl";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MENTOR_PHOTO_CONTENT_TYPES,
  MENTOR_PHOTO_MAX_BYTES,
  mentorPhotoPathPrefix,
} from "@/lib/mentor-photo";

interface MentorPhotoUploadProps {
  mentorId: string;
  name: string | null;
  image: string | null;
  // Smaller layout for table rows (admin mentors list)
  compact?: boolean;
}

export default function MentorPhotoUpload({
  mentorId,
  name,
  image: initialImage,
  compact = false,
}: MentorPhotoUploadProps) {
  const t = useTranslations("MentorForm");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(initialImage);
  const [progress, setProgress] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState("");

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "M";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    if (!MENTOR_PHOTO_CONTENT_TYPES.includes(file.type)) {
      setError(t("photoInvalidType"));
      return;
    }
    if (file.size > MENTOR_PHOTO_MAX_BYTES) {
      setError(t("photoTooLarge"));
      return;
    }

    setProgress(0);
    try {
      const blob = await upload(
        `${mentorPhotoPathPrefix(mentorId)}${file.name}`,
        file,
        {
          access: "public",
          handleUploadUrl: `/api/mentors/${mentorId}/photo/upload`,
          onUploadProgress: ({ percentage }) => setProgress(percentage),
        }
      );

      const res = await fetch(`/api/mentors/${mentorId}/photo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("genericError"));
      }

      setImage(blob.url);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    } finally {
      setProgress(null);
    }
  };

  const handleRemove = async () => {
    setError("");
    setIsRemoving(true);
    try {
      const res = await fetch(`/api/mentors/${mentorId}/photo`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("genericError"));
      }
      setImage(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    } finally {
      setIsRemoving(false);
    }
  };

  const isUploading = progress !== null;
  const isBusy = isUploading || isRemoving;

  return (
    <div className={compact ? "space-y-1" : "space-y-3"}>
      <div className={`flex items-center ${compact ? "gap-2" : "gap-4"}`}>
        <Avatar className={compact ? "h-10 w-10" : "h-20 w-20"}>
          <AvatarImage src={image || undefined} alt={name || "Mentor"} />
          <AvatarFallback className={compact ? "text-xs" : "text-xl"}>
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-2"}`}>
          <input
            ref={inputRef}
            type="file"
            accept={MENTOR_PHOTO_CONTENT_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => inputRef.current?.click()}
            aria-label={compact ? (image ? t("changePhoto") : t("uploadPhoto")) : undefined}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {!compact &&
              (isUploading
                ? `${t("uploadingPhoto")}${progress ? ` ${Math.round(progress)}%` : ""}`
                : image
                  ? t("changePhoto")
                  : t("uploadPhoto"))}
          </Button>
          {image && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isBusy}
              onClick={handleRemove}
              aria-label={t("removePhoto")}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
              {!compact && t("removePhoto")}
            </Button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground">{t("photoHint")}</p>
      )}
      {error && (
        <p className={`text-destructive ${compact ? "text-xs" : "text-sm"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
