"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NewHelpRequestPage() {
  const t = useTranslations("Help");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/help");
    }
  }, [status, router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!session;
  const isApproved = session?.user?.status === "ACTIVE";

  if (isLoggedIn && !isApproved) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[70vh]">
        <Card className="max-w-md w-full border-none shadow-xl bg-card/70 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t("lockedTitle")}</CardTitle>
            <CardDescription className="pt-2">{t("lockedDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button asChild>
              <Link href="/">{t("lockedCTA")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/help/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create help request");
      }

      router.push("/help");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-2xl mx-auto px-4">
      <div className="mb-6">
        <Link href="/help" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Help Board
        </Link>
      </div>

      <Card className="border border-border/50 bg-card/65 backdrop-blur-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">{t("newRequest")}</CardTitle>
          <CardDescription>
            Detail what kind of help you need. Other members will be able to see this and offer their help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-xs font-semibold">
                {t("requestTitle")}
              </Label>
              <Input
                id="title"
                placeholder="e.g. Need assistance proofreading my resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                {t("requestDesc")}
              </Label>
              <Textarea
                id="description"
                placeholder="Provide details about the help you are looking for, such as the industry, specific questions you have, or how long you expect the help to take."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full font-bold">
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("newRequest")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
