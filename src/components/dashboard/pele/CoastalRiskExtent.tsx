import { formatNumber } from "@/lib/format";
import type { CoastalRiskData } from "@/types";

interface CoastalRiskExtentProps {
  data?: CoastalRiskData | null;
}

export function CoastalRiskExtent({ data }: CoastalRiskExtentProps) {
  if (!data) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6 rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm">
      <header className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Ecosystem Extent Account
        </p>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-semibold text-slate-900">{data.title}</h2>
          <p className="text-sm leading-relaxed text-slate-600">{data.description}</p>
        </div>
      </header>

      {data.metrics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {data.metrics.map((metric) => (
            <article
              key={metric.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
            >
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {metric.value == null
                  ? "Pending"
                  : `${formatNumber(metric.value, {
                      maximumFractionDigits: metric.value < 10 ? 1 : 0,
                    })} ${metric.unit ?? ""}`}
              </p>
              {metric.description ? (
                <p className="mt-2 text-sm text-slate-500">{metric.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm leading-relaxed text-slate-500">
          Coastal risk and shoreline defence outputs are pending. This section is ready to
          display mapped exposure, shoreline defence, and related summary metrics when the
          final data is supplied.
        </div>
      )}

      {data.mapLink ? (
        <div>
          <a
            href={data.mapLink.url}
            target="_blank"
            rel="noreferrer"
            className="border-primary/60 text-primary hover:bg-primary/10 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
          >
            {data.mapLink.label}
          </a>
        </div>
      ) : null}
    </section>
  );
}
