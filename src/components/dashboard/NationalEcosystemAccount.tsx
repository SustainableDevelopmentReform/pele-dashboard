import { EcosystemConditionCard } from "@/components/dashboard/EcosystemConditionCard";
import { EcosystemDonutChart } from "@/components/dashboard/EcosystemDonutChart";
import { sumEcosystemAreas } from "@/lib/calculations";
import { formatArea } from "@/lib/format";
import type { AreaUnit, EcosystemKey, NationalData, SiteProfile } from "@/types";

const DEFAULT_FEATURED_ECOSYSTEMS: EcosystemKey[] = [
  "coralReef",
  "reefFlats",
  "seagrass",
  "mangroves",
];

interface NationalEcosystemAccountProps {
  national: NationalData;
  profile?: SiteProfile;
}

export function NationalEcosystemAccount({
  national,
  profile = "generic",
}: NationalEcosystemAccountProps) {
  const total = sumEcosystemAreas(national.ecosystems);
  const areaUnit: AreaUnit = national.areaUnit ?? "ha";
  const featuredEcosystems =
    national.featuredEcosystems?.filter((key) => national.ecosystems[key] != null) ??
    DEFAULT_FEATURED_ECOSYSTEMS;
  const title =
    profile === "pele" ? "Pele Ocean Ecosystem Extent" : "Ocean Ecosystem Extent";
  const subtitle =
    profile === "pele"
      ? `Total mapped extent: ${formatArea(total, areaUnit)} across Pele benthic classes.`
      : `Total mapped extent: ${formatArea(total, areaUnit)} across key marine ecosystems.`;

  return (
    <section className="flex flex-col gap-8 rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm">
      <header className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Ecosystem Extent Account
        </p>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <EcosystemDonutChart
          ecosystems={national.ecosystems}
          areaUnit={areaUnit}
          subtitle={
            profile === "pele"
              ? "Distribution across Pele mapped benthic classes"
              : "Distribution across ecosystem classes in the template dataset"
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredEcosystems.map((ecosystem) => (
            <EcosystemConditionCard
              key={ecosystem}
              ecosystem={ecosystem}
              extent={national.ecosystems[ecosystem]}
              areaUnit={areaUnit}
              conditionLabel={national.ecosystemConditionLabels?.[ecosystem]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
