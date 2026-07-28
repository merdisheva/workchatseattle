"use client";

import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { Handshake, HeartHandshake, Lock, User } from "lucide-react";

interface HelpItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface HelpCardProps {
  item: HelpItem;
  type: "request" | "offer";
  onConnect?: (id: string) => void;
}

export default function HelpCard({ item, type, onConnect }: HelpCardProps) {
  const t = useTranslations("Help");
  const { data: session } = useSession();

  const isOwner = session?.user?.id === item.userId;
  const isApproved = session?.user?.status === "ACTIVE";
  const isLoggedIn = !!session;

  const date = new Date(item.createdAt);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 bg-card/65 backdrop-blur-sm">
      <CardContent className="flex h-full flex-col p-6 justify-between">
        <div>
          {/* Header with Creator Info & Type Badge */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border">
                {item.user.image && (
                  <AvatarImage src={item.user.image} alt={item.user.name || "User"} />
                )}
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-semibold">
                  {getInitials(item.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-semibold text-foreground truncate max-w-[120px]">
                  {item.user.name || "Community Member"}
                </p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <Badge variant={type === "request" ? "destructive" : "default"} className="font-medium">
              {type === "request" ? (
                <span className="flex items-center gap-1">
                  <Handshake className="h-3 w-3" />
                  {t("requestsTab")}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <HeartHandshake className="h-3 w-3" />
                  {t("offersTab")}
                </span>
              )}
            </Badge>
          </div>

          {/* Title & Description */}
          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground line-clamp-2">
            {item.title}
          </h3>
          <p className="mb-6 text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
            {item.description}
          </p>
        </div>

        {/* Action Button Footer */}
        <div className="pt-4 border-t border-border/30">
          {isOwner ? (
            <Button variant="secondary" className="w-full text-xs font-semibold" asChild>
              <Link href="/help/dashboard">
                <User className="mr-2 h-3.5 w-3.5" />
                {t("myPosts")}
              </Link>
            </Button>
          ) : !isLoggedIn ? (
            <Button variant="outline" className="w-full text-xs font-semibold" asChild>
              <Link href="/auth/signin">
                <Lock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Sign in to Connect
              </Link>
            </Button>
          ) : !isApproved ? (
            <Button variant="outline" disabled className="w-full text-xs font-semibold">
              <Lock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              Locked (Pending Approval)
            </Button>
          ) : (
            <Button
              className="w-full text-xs font-bold"
              onClick={() => onConnect && onConnect(item.id)}
            >
              <Handshake className="mr-2 h-4 w-4" />
              {t("connect")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
