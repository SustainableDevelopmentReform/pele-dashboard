import { ECOSYSTEM_COLORS, ECOSYSTEM_LABELS } from "@/lib/constants";
import { formatArea } from "@/lib/format";
import type { AreaUnit, EcosystemKey } from "@/types";

interface EcosystemConditionCardProps {
  ecosystem: EcosystemKey;
  extent: number | null | undefined;
  conditionLabel?: string | null;
  areaUnit?: AreaUnit;
}

const DEFAULT_CONDITION_LABELS: Partial<Record<EcosystemKey, string>> = {
  coralReef: "Condition: XX% live coral cover",
  reefFlats: "Condition: XX water quality rating",
  seagrass: "Condition: XX% cover and X species diversity",
  mangroves: "Condition: XX% average canopy cover",
};

export function EcosystemConditionCard({
  ecosystem,
  extent,
  conditionLabel,
  areaUnit = "ha",
}: EcosystemConditionCardProps) {
  const label = ECOSYSTEM_LABELS[ecosystem];
  const value = extent != null ? formatArea(extent, areaUnit) : "Data not available";
  const condition =
    conditionLabel === undefined ? DEFAULT_CONDITION_LABELS[ecosystem] : conditionLabel;

  return (
    <article className="flex min-h-[180px] flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: ECOSYSTEM_COLORS[ecosystem] }}
          aria-hidden
        />
        <h4 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
          {label}
        </h4>
      </header>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {condition ? <p className="text-sm text-slate-500">{condition}</p> : null}
    </article>
  );
}
