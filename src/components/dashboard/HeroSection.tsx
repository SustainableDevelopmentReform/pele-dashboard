import { format } from "date-fns";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AreaUnit, NarrativeIntro, NationalData, SiteProfile } from "@/types";
import { sumEcosystemAreas } from "@/lib/calculations";
import { formatArea } from "@/lib/format";

interface HeroSectionProps {
  national: NationalData;
  introduction: NarrativeIntro;
  profile?: SiteProfile;
  logoSrc?: string | null;
  badgeLabel?: string | null;
}

export function HeroSection({
  national,
  introduction,
  profile = "generic",
  logoSrc,
  badgeLabel,
}: HeroSectionProps) {
  const totalArea = sumEcosystemAreas(national.ecosystems);
  const areaUnit: AreaUnit = national.areaUnit ?? "ha";
  const updatedDate = new Date(introduction.lastUpdated);
  const formattedDate = Number.isNaN(updatedDate.getTime())
    ? introduction.lastUpdated
    : format(updatedDate, "d MMMM yyyy");
  const isPele = profile === "pele";

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/90 p-10 shadow-lg">
      <div className="relative z-[1] flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="text-primary flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase">
            {isPele ? null : (
              <span className="border-primary/50 text-primary rounded-full border px-3 py-1 text-xs tracking-wide">
                Beta
              </span>
            )}
            <span>
              {badgeLabel ??
                (isPele ? "PIELSN • Pele Island" : "GOAP • Ocean Accounts Dashboard")}
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {introduction.title}
          </h1>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="space-y-4 [&_strong]:text-slate-900"
            >
              {introduction.content}
            </ReactMarkdown>
          </div>
        </div>
        {isPele && logoSrc ? (
          <div className="flex min-w-[240px] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            <div className="relative h-32 w-48">
              <Image
                src={logoSrc}
                alt="PIELSN logo"
                fill
                sizes="192px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-medium text-slate-700">Last updated</p>
              <p className="text-slate-500">{formattedDate}</p>
            </div>
          </div>
        ) : (
          <div className="border-primary/30 bg-primary-soft/60 flex min-w-[240px] flex-col gap-4 rounded-2xl border p-6 text-sm text-slate-700">
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Ecosystem Extent Snapshot
            </span>
            <span className="text-3xl font-semibold text-slate-900">
              {formatArea(totalArea, areaUnit)}
            </span>
            <div>
              <p className="font-medium text-slate-700">Last updated</p>
              <p className="text-slate-500">{formattedDate}</p>
            </div>
            <div>
              <p className="font-medium text-slate-700">Data source</p>
              <p className="text-slate-500">{national.metadata.dataSource}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
