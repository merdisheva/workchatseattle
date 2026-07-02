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
  const [error, setError] = useState<string | null>(null);

  const handleApproval = async (approve: boolean) => {
    setIsLoading(true);
    setError(null);
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
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Error ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update mentor:", error);
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isApproved) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleApproval(false)}
          disabled={isLoading}
        >
          <X className="mr-1 h-4 w-4" />
          {isLoading ? "Revoking..." : "Revoke"}
        </Button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="default"
        size="sm"
        onClick={() => handleApproval(true)}
        disabled={isLoading}
      >
        <Check className="mr-1 h-4 w-4" />
        {isLoading ? "Approving..." : "Approve"}
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
