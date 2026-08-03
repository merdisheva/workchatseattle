"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

interface OutcomeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, rating: number | null, isPublic: boolean, unpause: boolean) => Promise<void>;
  partnerName: string;
  showUnpauseOption?: boolean;
  unpauseLabel?: string;
  initialData?: {
    content: string;
    rating: number | null;
    isPublic: boolean;
  };
}

export default function OutcomeFormModal({
  isOpen,
  onClose,
  onSubmit,
  partnerName,
  showUnpauseOption,
  unpauseLabel,
  initialData,
}: OutcomeFormModalProps) {
  const t = useTranslations("Help");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [unpause, setUnpause] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      setRating(initialData.rating);
      setIsPublic(initialData.isPublic);
    } else {
      setContent("");
      setRating(null);
      setIsPublic(false);
      setUnpause(false);
    }
  }, [initialData, isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(content, rating, isPublic, unpause);
      onClose();
    } catch (error) {
      console.error("Failed to submit outcome reflection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>{t("outcomeTitle")}</DialogTitle>
            <DialogDescription className="text-xs pt-1">
              {t("outcomeDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4 mt-2">
            {/* Rating Star Selection */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold">{t("outcomeRating")}</Label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform active:scale-95 hover:scale-110"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors duration-150 ${
                        star <= (hoverRating ?? rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/35"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Outcome Text Area */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="outcome-content" className="text-xs font-semibold">
                What did you accomplish with <strong>{partnerName}</strong>?
              </Label>
              <Textarea
                id="outcome-content"
                placeholder={t("outcomePlaceholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                className="resize-none"
              />
            </div>

            {/* Public/Private toggle */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="outcome-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="outcome-public"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer select-none"
              >
                {t("outcomePublic")}
              </label>
            </div>

            {showUnpauseOption && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="outcome-unpause"
                  checked={unpause}
                  onChange={(e) => setUnpause(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="outcome-unpause"
                  className="text-xs font-semibold leading-none text-foreground cursor-pointer select-none"
                >
                  {unpauseLabel || "Unpause my post so it is visible to others again"}
                </label>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-semibold"
            >
              {t("proposeCancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-bold"
            >
              {isSubmitting ? "Saving..." : t("outcomeSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
