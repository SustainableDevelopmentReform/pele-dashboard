"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EcosystemConditionCard } from "@/components/dashboard/EcosystemConditionCard";
import { EcosystemDonutChart } from "@/components/dashboard/EcosystemDonutChart";
import { sumEcosystemAreas } from "@/lib/calculations";
import { formatArea } from "@/lib/format";
import type {
  AreaUnit,
  EcosystemKey,
  ExternalLink,
  SiteProfile,
  SubnationalData,
} from "@/types";

interface AreaSelectorProps {
  subnational: SubnationalData;
  initialAreaId?: string | null;
  profile?: SiteProfile;
  areaUnit?: AreaUnit;
}

const DEFAULT_FEATURED_ECOSYSTEMS: EcosystemKey[] = [
  "coralReef",
  "reefFlats",
  "seagrass",
  "mangroves",
];

const isExternalUrl = (url: string) => /^https?:\/\//.test(url);

function MappingLink({ link, areaId }: { link?: ExternalLink | null; areaId: string }) {
  const fallback = { label: "Open in spatial view", url: `/spatial?area=${areaId}` };
  const resolved = link ?? fallback;
  const className =
    "inline-flex items-center justify-center rounded-full border border-primary/60 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10";

  if (isExternalUrl(resolved.url)) {
    return (
      <a href={resolved.url} target="_blank" rel="noreferrer" className={className}>
        {resolved.label}
      </a>
    );
  }

  return (
    <Link href={resolved.url} className={className}>
      {resolved.label}
    </Link>
  );
}

export function AreaSelector({
  subnational,
  initialAreaId,
  profile = "generic",
  areaUnit = "ha",
}: AreaSelectorProps) {
  const initialId = useMemo(() => {
    if (initialAreaId && subnational.areas.some((area) => area.id === initialAreaId)) {
      return initialAreaId;
    }
    return subnational.areas[0]?.id ?? "";
  }, [initialAreaId, subnational.areas]);

  const [selectedId, setSelectedId] = useState(initialId);

  useEffect(() => {
    if (!initialAreaId) {
      return;
    }
    const exists = subnational.areas.some((area) => area.id === initialAreaId);
    if (exists) {
      setSelectedId(initialAreaId);
    }
  }, [initialAreaId, subnational.areas]);

  const options = useMemo(
    () =>
      subnational.areas.map((area) => ({
        id: area.id,
        name: area.name,
        total: sumEcosystemAreas(area.ecosystems),
      })),
    [subnational.areas],
  );

  const selectedArea = useMemo(() => {
    if (subnational.areas.length === 0) {
      return undefined;
    }
    return (
      subnational.areas.find((area) => area.id === selectedId) ?? subnational.areas[0]
    );
  }, [selectedId, subnational.areas]);

  return (
    <section className="flex flex-col gap-6 rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm">
      <header className="flex flex-col gap-3">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Explore Accounting Areas
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {profile === "pele"
              ? "Compare ecosystem extent across Pele Island coastal areas"
              : "Compare ecosystem extent across mapped areas"}
          </h2>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex w-full max-w-sm flex-col gap-1 text-sm font-medium text-slate-600">
            Area selection
            <select
              className="focus:border-primary rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 shadow-sm focus:outline-none"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} • {formatArea(option.total, areaUnit)}
                </option>
              ))}
            </select>
          </label>
          {selectedArea ? (
            <MappingLink
              areaId={selectedArea.id}
              link={selectedArea.spatialLink ?? subnational.spatialLink}
            />
          ) : null}
        </div>
        {selectedArea ? (
          <p className="text-sm text-slate-500">
            {selectedArea.description ??
              `Total mapped extent of ${formatArea(
                sumEcosystemAreas(selectedArea.ecosystems),
                areaUnit,
              )}.`}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Select an area to view its extent account.
          </p>
        )}
      </header>

      {selectedArea ? (
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <EcosystemDonutChart
            ecosystems={selectedArea.ecosystems}
            areaUnit={areaUnit}
            title={`${selectedArea.name} Ecosystem Extent`}
            subtitle={`Total extent: ${formatArea(
              sumEcosystemAreas(selectedArea.ecosystems),
              areaUnit,
            )}`}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {(selectedArea.featuredEcosystems ?? DEFAULT_FEATURED_ECOSYSTEMS).map(
              (ecosystem) => (
                <EcosystemConditionCard
                  key={ecosystem}
                  ecosystem={ecosystem}
                  extent={selectedArea.ecosystems[ecosystem]}
                  areaUnit={areaUnit}
                  conditionLabel={selectedArea.ecosystemConditionLabels?.[ecosystem]}
                />
              ),
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-6 text-sm text-slate-500">
          Add an accounting area to view its ecosystem extent account.
        </div>
      )}
    </section>
  );
}
