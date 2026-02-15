"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MentorFormProps {
  existingMentor?: {
    id: string;
    bio: string;
    linkedInUrl?: string | null;
    contactEmail: string;
    industries: { industryId: string }[];
    expertiseAreas: { expertiseAreaId: string }[];
  };
}

interface Option {
  id: string;
  name: string;
}

export default function MentorRegistrationForm({
  existingMentor,
}: MentorFormProps) {
  const router = useRouter();
  const isEditing = !!existingMentor;

  const [bio, setBio] = useState(existingMentor?.bio || "");
  const [linkedInUrl, setLinkedInUrl] = useState(
    existingMentor?.linkedInUrl || ""
  );
  const [contactEmail, setContactEmail] = useState(
    existingMentor?.contactEmail || ""
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    existingMentor?.industries.map((i) => i.industryId) || []
  );
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(
    existingMentor?.expertiseAreas.map((e) => e.expertiseAreaId) || []
  );

  const [industries, setIndustries] = useState<Option[]>([]);
  const [expertiseAreas, setExpertiseAreas] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch("/api/mentors/options");
        const data = await response.json();
        setIndustries(data.industries);
        setExpertiseAreas(data.expertiseAreas);
      } catch (err) {
        console.error("Failed to fetch options:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOptions();
  }, []);

  const toggleIndustry = (id: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleExpertise = (id: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (selectedIndustries.length === 0) {
      setError("Please select at least one industry");
      setIsSubmitting(false);
      return;
    }

    if (selectedExpertise.length === 0) {
      setError("Please select at least one area of expertise");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditing ? "/api/mentors/profile" : "/api/mentors/register";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio,
          linkedInUrl: linkedInUrl || null,
          contactEmail,
          industryIds: selectedIndustries,
          expertiseAreaIds: selectedExpertise,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(
        isEditing ? "/mentor/profile" : "/mentor/profile?registered=true"
      );
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Your Profile" : "Become a Mentor"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">About You *</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential mentees about your background, experience, and what you can help with..."
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Share your professional background, areas of expertise, and the
              kind of guidance you can offer.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="mentor@example.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              This email will be visible to people looking for mentors.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
            <Input
              id="linkedInUrl"
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="space-y-2">
            <Label>Industries *</Label>
            <p className="text-xs text-muted-foreground">
              Select the industries you have experience in.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {industries.map((industry) => (
                <Badge
                  key={industry.id}
                  variant={
                    selectedIndustries.includes(industry.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry.id)}
                >
                  {industry.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Areas of Expertise *</Label>
            <p className="text-xs text-muted-foreground">
              Select the areas where you can provide guidance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {expertiseAreas.map((area) => (
                <Badge
                  key={area.id}
                  variant={
                    selectedExpertise.includes(area.id) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleExpertise(area.id)}
                >
                  {area.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Submitting..."
                : isEditing
                ? "Save Changes"
                : "Submit Application"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>

          {!isEditing && (
            <p className="text-xs text-muted-foreground">
              Note: Your profile will be reviewed by an admin before being
              published.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
