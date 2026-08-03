"use client";

import { useState } from "react";
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

interface ConnectionProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string, contact: string) => Promise<void>;
  title: string;
  creatorName: string;
}

export default function ConnectionProposalModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  creatorName,
}: ConnectionProposalModalProps) {
  const t = useTranslations("Help");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(message, contact);
      setMessage("");
      setContact("");
      onClose();
    } catch (error) {
      console.error("Failed to submit connection proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>{t("proposeConnection")}</DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Connect with <strong>{creatorName}</strong> regarding their post: <span className="italic">"{title}"</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 mt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="propose-message" className="text-xs font-semibold">
                {t("proposeMessage")}
              </Label>
              <Textarea
                id="propose-message"
                placeholder={t("proposePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="propose-contact" className="text-xs font-semibold">
                Your Contact Info (Required) <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="propose-contact"
                placeholder="E.g., email (john@example.com), phone number, or Telegram/Slack username"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                rows={2}
                required
                className="resize-none"
              />
              <span className="text-[10px] text-muted-foreground">
                This contact info will be immediately visible to the post owner.
              </span>
            </div>
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
              {isSubmitting ? "Sending..." : t("proposeSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
