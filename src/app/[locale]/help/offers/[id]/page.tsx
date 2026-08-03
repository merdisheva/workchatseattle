"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, HeartHandshake, Lock, Pause, Play, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import ConnectionProposalModal from "@/components/help/ConnectionProposalModal";

interface OfferData {
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

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("Help");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { id: offerId } = use(params);

  const [offer, setOffer] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/help");
    }
  }, [status, router]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/help/offers/${offerId}`);
      if (res.ok) {
        setOffer(await res.json());
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
      fetchOfferDetails();
    }
  }, [session?.user?.id, offerId]);

  const handleToggleStatus = async () => {
    if (!offer || isTogglingStatus) return;
    setIsTogglingStatus(true);
    const newStatus = offer.status === "PAUSED" ? "OPEN" : "PAUSED";
    try {
      const res = await fetch(`/api/help/offers/${offerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOffer({ ...offer, status: newStatus });
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

  const handleConnectionSubmit = async (message: string, contact: string) => {
    if (!offer) return;
    try {
      const res = await fetch("/api/help/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          message,
          contact,
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
        Loading offer details...
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
        Offer not found.
      </div>
    );
  }

  const isOwner = session?.user?.id === offer.userId;
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
                {offer.user.image && (
                  <AvatarImage src={offer.user.image} alt={offer.user.name || "User"} />
                )}
                <AvatarFallback className="text-xs bg-muted text-muted-foreground font-semibold">
                  {getInitials(offer.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-foreground">{offer.user.name || "Community Member"}</p>
                <p className="text-xs text-muted-foreground">
                  Posted on {new Date(offer.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <Badge variant="default" className="font-medium text-xs">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  {t("offersTab")}
                </span>
              </Badge>
              {offer.status === "PAUSED" ? (
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
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{offer.title}</h1>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{offer.description}</p>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-border/30 flex justify-end gap-3">
            {isOwner ? (
              <Button
                variant={offer.status === "PAUSED" ? "outline" : "secondary"}
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className="font-bold text-xs flex items-center gap-2"
              >
                {offer.status === "PAUSED" ? (
                  <>
                    <Play className="h-4 w-4 text-emerald-500" />
                    Resume Offer
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 text-amber-500" />
                    Pause Offer
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
                disabled={offer.status === "PAUSED"}
                className="font-bold text-xs flex items-center gap-2"
              >
                <HeartHandshake className="h-4 w-4" />
                {offer.status === "PAUSED" ? "Offer Paused" : t("connect")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection proposal modal */}
      {isConnectOpen && offer && (
        <ConnectionProposalModal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          onSubmit={handleConnectionSubmit}
          title={offer.title}
          creatorName={offer.user.name || "Community Member"}
        />
      )}
    </div>
  );
}
