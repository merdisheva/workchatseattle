"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Handshake, Lock, Pause, Play, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import ConnectionProposalModal from "@/components/help/ConnectionProposalModal";

interface RequestData {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "OPEN" | "PAUSED" | "CANCELLED";
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("Help");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { id: requestId } = use(params);

  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/help");
    }
  }, [status, router]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/help/requests/${requestId}`);
      if (res.ok) {
        setRequest(await res.json());
      } else {
        router.push("/help");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchRequestDetails();
    }
  }, [session?.user?.id, requestId]);

  const handleToggleStatus = async () => {
    if (!request || isTogglingStatus) return;
    setIsTogglingStatus(true);
    const newStatus = request.status === "PAUSED" ? "OPEN" : "PAUSED";
    try {
      const res = await fetch(`/api/help/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRequest({ ...request, status: newStatus });
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleConnectTrigger = () => {
    setIsConnectOpen(true);
  };

  const handleConnectionSubmit = async (message: string) => {
    if (!request) return;
    try {
      const titleText = `Helping: ${request.title}`;
      const descText = `Dedicated offer to collaborate on request "${request.title}".`;
      
      const createOfferRes = await fetch("/api/help/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleText, description: descText }),
      });
      
      if (!createOfferRes.ok) throw new Error("Failed to initialize offer for connection");
      const newOffer = await createOfferRes.json();

      const res = await fetch("/api/help/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          offerId: newOffer.id,
          message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to make connection");
      }

      router.push("/help/dashboard");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to connect.");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
        Loading request details...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
        Request not found.
      </div>
    );
  }

  const isOwner = session?.user?.id === request.userId;
  const isApproved = session?.user?.status === "ACTIVE";

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/help" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ways to Help
        </Link>
      </div>

      <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-md overflow-hidden">
        <CardContent className="p-8">
          {/* Creator Profile Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                {request.user.image && (
                  <AvatarImage src={request.user.image} alt={request.user.name || "User"} />
                )}
                <AvatarFallback className="text-xs bg-muted text-muted-foreground font-semibold">
                  {getInitials(request.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-foreground">{request.user.name || "Community Member"}</p>
                <p className="text-xs text-muted-foreground">
                  Posted on {new Date(request.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <Badge variant="destructive" className="font-medium text-xs">
                <span className="flex items-center gap-1">
                  <Handshake className="h-3.5 w-3.5" />
                  {t("requestsTab")}
                </span>
              </Badge>
              {request.status === "PAUSED" ? (
                <Badge variant="secondary" className="font-semibold text-[10px] uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Paused
                </Badge>
              ) : (
                <Badge variant="secondary" className="font-semibold text-[10px] uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{request.title}</h1>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{request.description}</p>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-border/30 flex justify-end gap-3">
            {isOwner ? (
              <Button
                variant={request.status === "PAUSED" ? "outline" : "secondary"}
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className="font-bold text-xs flex items-center gap-2"
              >
                {request.status === "PAUSED" ? (
                  <>
                    <Play className="h-4 w-4 text-emerald-500" />
                    Resume Request
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 text-amber-500" />
                    Pause Request
                  </>
                )}
              </Button>
            ) : !isApproved ? (
              <Button variant="outline" disabled className="text-xs font-semibold">
                <Lock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Locked (Pending Approval)
              </Button>
            ) : (
              <Button
                onClick={handleConnectTrigger}
                disabled={request.status === "PAUSED"}
                className="font-bold text-xs flex items-center gap-2"
              >
                <Handshake className="h-4 w-4" />
                {request.status === "PAUSED" ? "Request Paused" : t("connect")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection proposal modal */}
      {isConnectOpen && request && (
        <ConnectionProposalModal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          onSubmit={handleConnectionSubmit}
          title={request.title}
          creatorName={request.user.name || "Community Member"}
        />
      )}
    </div>
  );
}
