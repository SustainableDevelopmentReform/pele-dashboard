import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { MapViewer } from "@/components/spatial/MapViewer";
import { GEEEmbed } from "@/components/spatial/GEEEmbed";
import { PeleStaticMapGallery } from "@/components/spatial/PeleStaticMapGallery";
import {
  loadNarrativeData,
  loadResolvedSiteConfig,
  loadSpatialConfig,
  loadSubnationalData,
} from "@/lib/dataLoader";

export const metadata = {
  title: "Spatial mapping | Ocean Accounts",
  description:
    "Interactive spatial mapping and Earth Engine applications for exploring ocean accounts data.",
};

export default async function SpatialPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [spatial, narrative, subnational] = await Promise.all([
    loadSpatialConfig(),
    loadNarrativeData(),
    loadSubnationalData(),
  ]);
  const site = await loadResolvedSiteConfig();
  const isPele = site.siteProfile === "pele";

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const areaParamRaw = resolvedSearchParams?.area;
  const areaParam = Array.isArray(areaParamRaw) ? areaParamRaw[0] : areaParamRaw;

  return (
    <>
      <Header
        profile={site.siteProfile}
        logoSrc={site.logoSrc}
        mappingLink={site.mappingLink}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-12">
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-8 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {isPele ? null : (
                  <span className="border-primary/50 text-primary rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                    Beta
                  </span>
                )}
                <span className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                  {isPele ? "Pele Mapping View" : "Spatial Analytics"}
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-slate-900">
                {isPele ? "Pele Island spatial mapping" : "Spatial Insights"}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600">
                {isPele
                  ? "Explore the Pele Island Google Earth Engine mapping app and review static map products prepared for reef, restoration, depth, and shoreline change planning."
                  : "Explore mapped ocean accounting areas with an interactive MapLibre GL JS map, and dive deeper through an embedded Google Earth Engine experience for temporal change analysis and interactive layers."}
              </p>
              <div className="text-primary flex flex-wrap gap-2 text-xs font-semibold">
                <Link
                  href={areaParam ? `/?area=${areaParam}` : "/"}
                  className="border-primary/40 hover:bg-primary/10 rounded-full border px-3 py-1"
                >
                  Return to dashboard overview
                </Link>
              </div>
            </div>
            {isPele ? (
              <div className="border-primary/30 bg-primary-soft/60 rounded-2xl border p-5 text-sm text-slate-700 shadow-inner">
                <p className="font-semibold text-slate-900">Map products</p>
                <p className="text-slate-500">Interactive GEE app</p>
                <p className="text-slate-500">5 static map products</p>
              </div>
            ) : (
              <div className="border-primary/30 bg-primary-soft/60 rounded-2xl border p-5 text-sm text-slate-700 shadow-inner">
                <p className="font-semibold text-slate-900">Spatial dataset</p>
                <p className="text-slate-500">
                  Polygons: {spatial.boundaries.subnational.features.length}
                </p>
                <p className="text-slate-500">
                  Key locations: {spatial.locations.length}
                </p>
              </div>
            )}
          </div>
        </section>

        {isPele ? null : (
          <MapViewer
            spatial={spatial}
            subnational={subnational}
            initialAreaId={areaParam}
          />
        )}

        <GEEEmbed config={spatial.geeApp} />

        {isPele ? <PeleStaticMapGallery /> : null}
      </main>
      <Footer
        footer={narrative.footer}
        profile={site.siteProfile}
        logoSrc={site.logoSrc}
      />
    </>
  );
}
