import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Mentor {
  id: string;
  bio: string;
  linkedInUrl?: string | null;
  contactEmail: string;
  user: {
    name: string | null;
    image: string | null;
  };
  industries: {
    industry: {
      name: string;
    };
  }[];
  expertiseAreas: {
    expertiseArea: {
      name: string;
    };
  }[];
}

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const initials = mentor.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "M";

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={mentor.user.image || undefined}
              alt={mentor.user.name || "Mentor"}
            />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{mentor.user.name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {mentor.industries.slice(0, 2).map(({ industry }) => (
                <Badge key={industry.name} variant="secondary" className="text-xs">
                  {industry.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {mentor.bio}
        </p>

        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Expertise
          </p>
          <div className="flex flex-wrap gap-1">
            {mentor.expertiseAreas.slice(0, 3).map(({ expertiseArea }) => (
              <Badge key={expertiseArea.name} variant="outline" className="text-xs">
                {expertiseArea.name}
              </Badge>
            ))}
            {mentor.expertiseAreas.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertiseAreas.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/mentors/${mentor.id}`}>View Profile</Link>
          </Button>
          {mentor.linkedInUrl && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={mentor.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <a href={`mailto:${mentor.contactEmail}`}>
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
