import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RejectedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <XCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Application Not Approved</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Unfortunately your application to join WorkChat Seattle was not
            approved at this time. You can still browse our public pages.
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
