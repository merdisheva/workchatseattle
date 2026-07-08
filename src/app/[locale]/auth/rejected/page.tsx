import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function RejectedPage() {
  const t = await getTranslations("Auth.Rejected");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <XCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("desc")}</p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild variant="default">
              <Link href="/events">{t("browseEvents")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{t("goHome")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
