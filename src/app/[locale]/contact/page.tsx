import { Metadata } from "next";
import Image from "next/image";
import { Mail, Facebook, Linkedin, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  return {
    title: t("title"),
    description: t("heroDesc"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  const contactMethods = [
    {
      icon: Facebook,
      title: t("fbGroupTitle"),
      description: t("fbGroupDesc"),
      link: "https://www.facebook.com/groups/workchatseattle",
      linkText: t("fbGroupLink"),
      external: true,
    },
    {
      icon: Mail,
      title: t("emailTitle"),
      description: t("emailDesc"),
      link: "mailto:workchatseattle@gmail.com",
      linkText: "workchatseattle@gmail.com",
      external: false,
    },
    {
      icon: Linkedin,
      title: t("linkedinTitle"),
      description: t("linkedinDesc"),
      link: "https://www.linkedin.com/company/work-chat-seattle/",
      linkText: t("linkedinLink"),
      external: true,
    },
    {
      icon: MapPin,
      title: t("locationTitle"),
      description: t("locationDesc"),
      link: null,
      linkText: t("locationLink"),
      external: false,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
            alt="Contact us"
            fill
            className="object-cover brightness-[0.35]"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
              {t("heroDesc")}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Contact Methods */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <Card key={method.title} className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <method.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  {method.description}
                </p>
                {method.link ? (
                  <a
                    href={method.link}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {method.linkText}
                  </a>
                ) : (
                  <span className="text-sm font-medium">{method.linkText}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t("faqTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("faqSubtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-base">{t("faq1Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("faq1Answer")}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-base">{t("faq2Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("faq2Answer")}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader>
                <CardTitle className="text-base">{t("faq3Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("faq3Answer")}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader>
                <CardTitle className="text-base">{t("faq4Question")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("faq4Answer")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seattle Map/Image Section */}
        <div className="mt-20 overflow-hidden rounded-2xl">
          <div className="relative h-[300px]">
            <Image
              src="https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1920&q=80"
              alt="Seattle skyline"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <MapPin className="mx-auto mb-4 h-12 w-12" />
                <h3 className="text-2xl font-bold">{t("seattleLocation")}</h3>
                <p className="mt-2 text-white/80">{t("seattleServing")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-white md:p-12">
          <h2 className="text-2xl font-bold">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">{t("ctaDesc")}</p>
          <a
            href="https://www.facebook.com/groups/workchatseattle"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-primary ring-offset-background transition-colors hover:bg-white/90"
          >
            {t("ctaBtn")}
          </a>
        </div>
      </div>
    </div>
  );
}
