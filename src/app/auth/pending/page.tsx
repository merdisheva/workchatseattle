import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Application Under Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for applying to join WorkChat Seattle! Your application is
            being reviewed by an admin. You'll gain full access once approved.
          </p>
          <p className="text-sm text-muted-foreground">
            In the meantime, you can browse our public pages.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild variant="default">
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
