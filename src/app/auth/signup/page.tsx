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

export default function SignUpPage() {
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

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
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
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      router.push("/auth/signin?registered=true");
    } catch {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join WorkChat Seattle</CardTitle>
          <CardDescription>
            Tell us a bit about yourself — an admin will review your application.
          </CardDescription>
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
                Account
              </h3>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={set("email")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={set("password")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                A few quick questions
              </h3>
              <div className="space-y-2">
                <Label htmlFor="whereDoYouLive">Where do you live?</Label>
                <Input
                  id="whereDoYouLive"
                  type="text"
                  placeholder="e.g. Seattle, Bellevue, Redmond…"
                  value={formData.whereDoYouLive}
                  onChange={set("whereDoYouLive")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="howDidYouHear">How did you hear about WorkChat Seattle?</Label>
                <Input
                  id="howDidYouHear"
                  type="text"
                  placeholder="e.g. Facebook group, friend, Google…"
                  value={formData.howDidYouHear}
                  onChange={set("howDidYouHear")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatDoYouExpect">
                  What do you expect from the group / what are you looking to find here?
                </Label>
                <Textarea
                  id="whatDoYouExpect"
                  placeholder="Tell us a bit about what you're hoping to get out of the community…"
                  value={formData.whatDoYouExpect}
                  onChange={set("whatDoYouExpect")}
                  rows={4}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting application..." : "Submit Application"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
