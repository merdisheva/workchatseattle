import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "WorkChatSeattle - Professional Network for Women",
    template: "%s | WorkChatSeattle",
  },
  description:
    "A professional network for Russian-speaking women in the Seattle area. Knowledge sharing, community building, and career development across all industries.",
  keywords: [
    "professional network",
    "women",
    "Seattle",
    "career development",
    "mentorship",
    "Russian-speaking",
  ],
  openGraph: {
    title: "WorkChatSeattle",
    description:
      "Professional network for Russian-speaking women in Seattle",
    type: "website",
    locale: "en_US",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Provide all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

