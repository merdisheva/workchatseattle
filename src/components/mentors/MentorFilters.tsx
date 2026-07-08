"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface MentorFiltersProps {
  industries: { id: string; name: string }[];
  expertiseAreas: { id: string; name: string }[];
  selectedIndustry?: string;
  selectedExpertise?: string;
}

export default function MentorFilters({
  industries,
  expertiseAreas,
  selectedIndustry,
  selectedExpertise,
}: MentorFiltersProps) {
  const t = useTranslations("Mentors");
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/mentors?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/mentors");
  };

  const hasFilters = selectedIndustry || selectedExpertise;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("industry")}</span>
        <Select
          value={selectedIndustry || "all"}
          onValueChange={(value) => updateFilter("industry", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("allIndustries")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allIndustries")}</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry.id} value={industry.id}>
                {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("expertiseFilter")}</span>
        <Select
          value={selectedExpertise || "all"}
          onValueChange={(value) => updateFilter("expertise", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("allExpertise")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allExpertise")}</SelectItem>
            {expertiseAreas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
