"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MentorApprovalButtonProps {
  mentorId: string;
  isApproved: boolean;
}

export function MentorApprovalButton({
  mentorId,
  isApproved,
}: MentorApprovalButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleApproval = async (approve: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved: approve }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update mentor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isApproved) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleApproval(false)}
        disabled={isLoading}
      >
        <X className="mr-1 h-4 w-4" />
        Revoke
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => handleApproval(true)}
      disabled={isLoading}
    >
      <Check className="mr-1 h-4 w-4" />
      Approve
    </Button>
  );
}
