"use client";

import { useState, useEffect, use } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Star, Clock, AlertCircle } from "lucide-react";
import OutcomeFormModal from "@/components/help/OutcomeFormModal";

interface HelpOutcome {
  id: string;
  userId: string;
  content: string;
  rating: number | null;
  isPublic: boolean;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ConnectionData {
  id: string;
  requestId: string;
  offerId: string;
  status: string;
  message: string | null;
  createdAt: string;
  request: {
    title: string;
    description: string;
    userId: string;
    user: { name: string | null; image: string | null };
  };
  offer: {
    title: string;
    description: string;
    userId: string;
    user: { name: string | null; image: string | null };
  };
  outcomes: HelpOutcome[];
}

export default function ConnectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("Help");
  const router = useRouter();
  const { data: session } = useSession();
  
  // Unwrap params using React.use()
  const { id: connectionId } = use(params);

  const [connection, setConnection] = useState<ConnectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOutcomeOpen, setIsOutcomeOpen] = useState(false);

  const isLoggedIn = !!session;
  const isApproved = session?.user?.status === "ACTIVE";

  const fetchConnectionDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/help/connections/${connectionId}`);
      if (res.ok) {
        setConnection(await res.json());
      } else {
        router.push("/help/dashboard");
      }
    } catch (error) {
      console.error("Failed to load connection space:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchConnectionDetails();
    }
  }, [session?.user?.id, connectionId]);

  if (isLoggedIn && !isApproved) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[70vh]">
        <Card className="max-w-md w-full border-none shadow-xl bg-card/70 backdrop-blur-md text-center p-8">
          <CardTitle className="text-2xl font-bold mb-4">{t("lockedTitle")}</CardTitle>
          <CardDescription className="mb-6">{t("lockedDesc")}</CardDescription>
          <Button asChild>
            <Link href="/">{t("lockedCTA")}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
        Loading connection space...
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
        Connection not found.
      </div>
    );
  }

  const isRequester = connection.request.userId === session?.user?.id;
  const partnerName = isRequester
    ? connection.offer.user.name || "Helper"
    : connection.request.user.name || "Requester";
  const partnerImage = isRequester
    ? connection.offer.user.image
    : connection.request.user.image;

  const myOutcome = connection.outcomes.find((o) => o.userId === session?.user?.id);
  const partnerOutcome = connection.outcomes.find((o) => o.userId !== session?.user?.id);

  const handleOutcomeSubmit = async (content: string, rating: number | null, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/help/connections/${connectionId}/outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, rating, isPublic }),
      });

      if (res.ok) {
        fetchConnectionDetails();
      } else {
        alert("Failed to submit outcome reflection");
      }
    } catch (err) {
      console.error(err);
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

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4.5 w-4.5 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-12 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/help/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Connection Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns - Content Spaces */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Alert Banner */}
          {connection.status === "ACCEPTED" && (
            <Card className="border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200">
              <CardContent className="flex items-center gap-3 p-4 text-xs font-semibold">
                <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div>
                  This collaboration is currently in progress. Work together with <strong>{partnerName}</strong>. 
                  Once done, mark it complete by submitting your outcome perspective.
                </div>
              </CardContent>
            </Card>
          )}

          {connection.status === "COMPLETED" && (
            <Card className="border border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200">
              <CardContent className="flex items-center gap-3 p-4 text-xs font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div>
                  Collaboration successfully completed! Both sides have logged their outcome perspectives.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Original Posts details */}
          <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Connection Space</CardTitle>
              <CardDescription>Details of the matched help request and offer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Help Request */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="font-semibold text-[10px]">REQUEST</Badge>
                  <h4 className="text-sm font-bold text-foreground">{connection.request.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap pl-6">{connection.request.description}</p>
              </div>

              <Separator className="bg-border/40" />

              {/* Help Offer */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="font-semibold text-[10px]">OFFER</Badge>
                  <h4 className="text-sm font-bold text-foreground">{connection.offer.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap pl-6">{connection.offer.description}</p>
              </div>

              {connection.message && (
                <>
                  <Separator className="bg-border/40" />
                  {/* Propose Intro Message */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      Introductory Message
                    </h5>
                    <p className="text-xs italic text-muted-foreground whitespace-pre-wrap pl-6">
                      "{connection.message}"
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Side by Side Outcomes */}
          {connection.status === "COMPLETED" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">{t("outcomePerspectives")}</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Requester Outcome */}
                <Card className="border border-border/50 bg-card/65 shadow-sm">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      {connection.request.user.image && (
                        <AvatarImage src={connection.request.user.image} />
                      )}
                      <AvatarFallback className="text-[10px] bg-muted font-bold">
                        {getInitials(connection.request.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xs font-bold text-foreground">{t("requesterPerspective")}</CardTitle>
                      <CardDescription className="text-[10px]">{connection.request.user.name}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap italic">
                      "{connection.outcomes.find((o) => o.userId === connection.request.userId)?.content || "No review left."}"
                    </p>
                    {renderStars(connection.outcomes.find((o) => o.userId === connection.request.userId)?.rating ?? null)}
                  </CardContent>
                </Card>

                {/* Helper Outcome */}
                <Card className="border border-border/50 bg-card/65 shadow-sm">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      {connection.offer.user.image && (
                        <AvatarImage src={connection.offer.user.image} />
                      )}
                      <AvatarFallback className="text-[10px] bg-muted font-bold">
                        {getInitials(connection.offer.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xs font-bold text-foreground">{t("helperPerspective")}</CardTitle>
                      <CardDescription className="text-[10px]">{connection.offer.user.name}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap italic">
                      "{connection.outcomes.find((o) => o.userId === connection.offer.userId)?.content || "No review left."}"
                    </p>
                    {renderStars(connection.outcomes.find((o) => o.userId === connection.offer.userId)?.rating ?? null)}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Actions Panel */}
        <div className="space-y-8">
          <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Collaboration Hub</CardTitle>
              <CardDescription>Log results or contact your collaborator.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connection.status === "ACCEPTED" && (
                <>
                  {!myOutcome ? (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Have you completed this help task? Reflect on the results to mark it complete.
                      </p>
                      <Button className="w-full text-xs font-bold" onClick={() => setIsOutcomeOpen(true)}>
                        {t("markCompleted")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3 bg-muted/50 rounded-lg border border-border/40 text-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                      <p className="text-xs font-bold text-foreground">{t("outcomeWaiting")}</p>
                      <p className="text-[10px] text-muted-foreground">
                        You successfully submitted your perspective. Once {partnerName} logs theirs, both reviews will be displayed side-by-side.
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold mt-1" onClick={() => setIsOutcomeOpen(true)}>
                        Edit My Outcome
                      </Button>
                    </div>
                  )}
                </>
              )}

              {connection.status === "COMPLETED" && (
                <div className="space-y-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold">{t("outcomeCompleted")}</p>
                  <p className="text-[10px]">
                    This help match is complete. Thank you for building and strengthening the WorkChat community!
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-[11px] font-semibold mt-2" onClick={() => setIsOutcomeOpen(true)}>
                    Edit My Reflection
                  </Button>
                </div>
              )}

              <Separator className="bg-border/40" />

              {/* Collaborator Profile details */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-foreground">Matched Participant</Label>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    {partnerImage && (
                      <AvatarImage src={partnerImage} />
                    )}
                    <AvatarFallback className="text-xs bg-muted font-bold">
                      {getInitials(partnerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{partnerName}</p>
                    <p className="text-[10px] text-muted-foreground">Community Member</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Outcome Form Modal */}
      <OutcomeFormModal
        isOpen={isOutcomeOpen}
        onClose={() => setIsOutcomeOpen(false)}
        onSubmit={handleOutcomeSubmit}
        partnerName={partnerName}
        initialData={
          myOutcome
            ? {
                content: myOutcome.content,
                rating: myOutcome.rating,
                isPublic: myOutcome.isPublic,
              }
            : undefined
        }
      />
    </div>
  );
}
