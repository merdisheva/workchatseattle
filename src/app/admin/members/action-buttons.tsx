"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MemberActionButtons({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (newStatus: "ACTIVE" | "REJECTED") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Error ${res.status}`);
      }
    } catch {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "ACTIVE") {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus("REJECTED")}
          disabled={isLoading}
        >
          <X className="mr-1 h-4 w-4" />
          {isLoading ? "..." : "Revoke"}
        </Button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus("ACTIVE")}
          disabled={isLoading}
        >
          <Check className="mr-1 h-4 w-4" />
          {isLoading ? "..." : "Re-approve"}
        </Button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  // PENDING
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => updateStatus("ACTIVE")}
          disabled={isLoading}
        >
          <Check className="mr-1 h-4 w-4" />
          {isLoading ? "..." : "Approve"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus("REJECTED")}
          disabled={isLoading}
        >
          <X className="mr-1 h-4 w-4" />
          {isLoading ? "..." : "Reject"}
        </Button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
