import { Suspense } from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import MentorCard from "@/components/mentors/MentorCard";
import { Button } from "@/components/ui/button";
import MentorFilters from "@/components/mentors/MentorFilters";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Mentors");
  return {
    title: t("title"),
    description: t("desc"),
  };
}

interface MentorsPageProps {
  searchParams: Promise<{
    industry?: string;
    expertise?: string;
  }>;
}

async function getMentors(industryId?: string, expertiseId?: string) {
  const mentors = await prisma.mentor.findMany({
    where: {
      isApproved: true,
      ...(industryId && {
        industries: {
          some: {
            industryId,
          },
        },
      }),
      ...(expertiseId && {
        expertiseAreas: {
          some: {
            expertiseAreaId: expertiseId,
          },
        },
      }),
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      industries: {
        include: {
          industry: true,
        },
      },
      expertiseAreas: {
        include: {
          expertiseArea: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return mentors;
}

async function getFilters() {
  const [industries, expertiseAreas] = await Promise.all([
    prisma.industry.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.expertiseArea.findMany({
      orderBy: { name: "asc" },
    }),
  ]);
  return { industries, expertiseAreas };
}

export default async function MentorsPage({ searchParams }: MentorsPageProps) {
  const params = await searchParams;
  const [mentors, filters, t] = await Promise.all([
    getMentors(params.industry, params.expertise),
    getFilters(),
    getTranslations("Mentors"),
  ]);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {t("desc")}
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/mentor/register">{t("becomeMentor")}</Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="h-10 animate-pulse rounded bg-muted" />}>
          <MentorFilters
            industries={filters.industries}
            expertiseAreas={filters.expertiseAreas}
            selectedIndustry={params.industry}
            selectedExpertise={params.expertise}
          />
        </Suspense>

        {/* Mentors Grid */}
        {mentors.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border-2 border-dashed p-12 text-center">
            <h3 className="text-lg font-medium">{t("noMentorsTitle")}</h3>
            <p className="mt-2 text-muted-foreground">
              {params.industry || params.expertise
                ? t("noMentorsFiltered")
                : t("noMentorsEmpty")}
            </p>
            <Button className="mt-6" asChild>
              <Link href="/mentor/register">{t("becomeMentor")}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
