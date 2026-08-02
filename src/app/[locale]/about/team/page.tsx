import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Team");
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  };
}

export default async function TeamPage() {
  const t = await getTranslations("Team");
  const tAbout = await getTranslations("About");

  const members = [
    {
      photo: "/images/team/masha-makarenkova.webp",
      name: t("member1Name"),
      role: t("member1Role"),
      bio: t("member1Bio"),
      bio2: t("member1Bio2"),
    },
    {
      photo: "/images/team/tatyana-yakushev.webp",
      name: t("member2Name"),
      role: t("member2Role"),
      bio: t("member2Bio"),
      bio2: t("member2Bio2"),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community/about-mission-audience.webp"
            alt="WorkChat Seattle team"
            fill
            className="object-cover brightness-[0.52]"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {members.map((member, index) => (
              <div
                key={member.name}
                className="grid items-center gap-12 lg:grid-cols-2"
              >
                <div
                  className={
                    index % 2 === 1 ? "order-1 lg:order-2" : "order-1"
                  }
                >
                  <div className="relative h-64 w-64 overflow-hidden rounded-full">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div
                  className={
                    index % 2 === 1 ? "order-2 lg:order-1" : "order-2"
                  }
                >
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {member.role}
                  </p>
                  <p className="mt-4 text-muted-foreground">{member.bio}</p>
                  {member.bio2 && (
                    <p className="mt-4 text-muted-foreground">{member.bio2}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">{tAbout("joinTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {tAbout("joinDesc")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://www.facebook.com/groups/workchatseattle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              {tAbout("joinBtn")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
