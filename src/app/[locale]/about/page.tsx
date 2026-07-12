import { Metadata } from "next";
import Image from "next/image";
import { Users, Target, Heart, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");

  const values = [
    {
      icon: Users,
      title: t("valuesCommunityTitle"),
      description: t("valuesCommunityDesc"),
    },
    {
      icon: Lightbulb,
      title: t("valuesKnowledgeTitle"),
      description: t("valuesKnowledgeDesc"),
    },
    {
      icon: Heart,
      title: t("valuesSupportTitle"),
      description: t("valuesSupportDesc"),
    },
    {
      icon: Target,
      title: t("valuesGrowthTitle"),
      description: t("valuesGrowthDesc"),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1556565681-306458ef93cd?w=1920&q=80"
            alt="Team collaboration"
            fill
            className="object-cover brightness-[0.35]"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-200">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80"
                alt="Women networking"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t("missionTitle")}</h2>
              <p className="mt-4 text-muted-foreground">{t("missionDesc1")}</p>
              <p className="mt-4 text-muted-foreground">{t("missionDesc2")}</p>
              <p className="mt-4 text-muted-foreground">{t("missionDesc3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold">{t("whatWeDoTitle")}</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">{t("whatWeDoItem1Title")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("whatWeDoItem1Desc")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">{t("whatWeDoItem2Title")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("whatWeDoItem2Desc")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">{t("whatWeDoItem3Title")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("whatWeDoItem3Desc")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">{t("whatWeDoItem4Title")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("whatWeDoItem4Desc")}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative order-1 h-[400px] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1573496130141-209d200cebd8?w=800&q=80"
                alt="Workshop session"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t("valuesTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("valuesSubtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-none bg-muted/30 text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seattle Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1920&q=80"
            alt="Seattle skyline"
            fill
            className="object-cover brightness-[0.3]"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">{t("seattleTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-200">
            {t("seattleDesc")}
          </p>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">{t("joinTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("joinDesc")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://www.facebook.com/groups/workchatseattle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              {t("joinBtn")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
