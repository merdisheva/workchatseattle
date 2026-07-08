"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const t = useTranslations("Auth.SignUp");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    whereDoYouLive: "",
    howDidYouHear: "",
    whatDoYouExpect: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError(t("passwordTooShort"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          whereDoYouLive: formData.whereDoYouLive,
          howDidYouHear: formData.howDidYouHear,
          whatDoYouExpect: formData.whatDoYouExpect,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("genericError"));
        setIsLoading(false);
        return;
      }

      router.push("/auth/signin?registered=true");
    } catch {
      setError(t("genericError"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("accountSection")}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullNameLabel")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={formData.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={formData.email}
                  onChange={set("email")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={set("password")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={set("confirmPassword")}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("questionsSection")}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="whereDoYouLive">{t("whereLabel")}</Label>
                <Input
                  id="whereDoYouLive"
                  type="text"
                  placeholder={t("wherePlaceholder")}
                  value={formData.whereDoYouLive}
                  onChange={set("whereDoYouLive")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="howDidYouHear">{t("howLabel")}</Label>
                <Input
                  id="howDidYouHear"
                  type="text"
                  placeholder={t("howPlaceholder")}
                  value={formData.howDidYouHear}
                  onChange={set("howDidYouHear")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatDoYouExpect">{t("expectLabel")}</Label>
                <Textarea
                  id="whatDoYouExpect"
                  placeholder={t("expectPlaceholder")}
                  value={formData.whatDoYouExpect}
                  onChange={set("whatDoYouExpect")}
                  rows={4}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("submitting") : t("submitBtn")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("haveAccount")}{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              {t("signInLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
