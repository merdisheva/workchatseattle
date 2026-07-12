import { Suspense } from "react";
import SignInForm from "./SignInForm";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const t = await getTranslations("Auth.SignIn");

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground">{t("loading")}</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
