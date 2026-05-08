"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { formatPercentage } from "@/lib/format";
import type { RestockingData, RestockingSpecies, RestockingSurvey } from "@/types";

interface RestockingAreasProps {
  data?: RestockingData | null;
}

const getLatestSurvey = (surveys: RestockingSurvey[]) =>
  [...surveys].sort((a, b) => b.year - a.year)[0];

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "d MMM yyyy");
};

export function RestockingAreas({ data }: RestockingAreasProps) {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(data?.species[0]?.id ?? "");
  const [selectedYears, setSelectedYears] = useState<Record<string, number>>({});

  const species: RestockingSpecies | null = useMemo(() => {
    if (!data?.species.length) {
      return null;
    }
    return data.species.find((item) => item.id === selectedSpeciesId) ?? data.species[0];
  }, [data?.species, selectedSpeciesId]);

  if (!data || !species) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm">
      <header className="flex flex-col gap-4 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{species.label}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Village restocking survey cards for Pele Island restoration monitoring.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.species.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSpeciesId(item.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                item.id === species.id
                  ? "border-primary bg-primary text-white"
                  : "hover:border-primary/50 hover:text-primary border-slate-200 bg-white text-slate-600"
              }`}
            >
              {item.displayName}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {species.sites.map((site) => {
          const selectedYear = selectedYears[site.id];
          const survey =
            site.surveys.find((item) => item.year === selectedYear) ??
            getLatestSurvey(site.surveys);
          const count = survey.clamsPlaced ?? survey.individualsPlaced;
          const countLabel =
            species.id === "giant-clam" ? "Number of clams placed" : "Number placed";

          return (
            <article
              key={site.id}
              className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{site.village}</h3>
                  <p className="text-xs tracking-wide text-slate-500 uppercase">
                    {site.coordinates
                      ? `${site.coordinates.latitude.toFixed(4)}, ${site.coordinates.longitude.toFixed(4)}`
                      : "Coordinates pending"}
                  </p>
                </div>
                <label className="flex flex-col gap-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Survey
                  <select
                    className="focus:border-primary rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm tracking-normal text-slate-700 normal-case focus:outline-none"
                    value={survey.year}
                    onChange={(event) =>
                      setSelectedYears((current) => ({
                        ...current,
                        [site.id]: Number(event.target.value),
                      }))
                    }
                  >
                    {[...site.surveys]
                      .sort((a, b) => b.year - a.year)
                      .map((item) => (
                        <option key={item.year} value={item.year}>
                          {item.year}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              {site.description ? (
                <p className="text-sm leading-relaxed text-slate-500">
                  {site.description}
                </p>
              ) : null}

              <dl className="grid gap-2 rounded-2xl border border-slate-200 bg-white/85 p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-medium text-slate-500">{countLabel}</dt>
                  <dd className="font-semibold text-slate-900">
                    {count == null ? "Pending" : count.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-medium text-slate-500">Species and size</dt>
                  <dd className="text-right font-semibold text-slate-900">
                    {survey.speciesAndSize}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-medium text-slate-500">
                    Date and 6-month survival
                  </dt>
                  <dd className="text-right font-semibold text-slate-900">
                    {formatDate(survey.restockingDate)} •{" "}
                    {survey.survivalRate6mo == null
                      ? "survival pending"
                      : `${formatPercentage(survey.survivalRate6mo)} survival`}
                  </dd>
                </div>
              </dl>

              {survey.notes ? (
                <p className="text-sm text-slate-500">{survey.notes}</p>
              ) : null}
            </article>
          );
        })}
      </div>

      {species.mapImage || species.mapLink ? (
        <div className="mt-5 flex flex-col gap-4">
          {species.mapImage ? (
            <figure className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <Image
                src={species.mapImage}
                alt={`${species.displayName} restocking map`}
                fill
                sizes="(min-width: 1280px) 1120px, 100vw"
                className="object-cover"
              />
            </figure>
          ) : null}
          {species.mapLink ? (
            <a
              href={species.mapLink.url}
              target="_blank"
              rel="noreferrer"
              className="border-primary/60 text-primary hover:bg-primary/10 inline-flex w-fit items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
            >
              {species.mapLink.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
