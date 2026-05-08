import Image from "next/image";

type StaticMapItem = {
  title: string;
  caption: string;
  href: string;
  type: "pdf" | "image";
};

const STATIC_MAPS: StaticMapItem[] = [
  {
    title: "Coral reef and seagrass mapping",
    caption:
      "Static benthic habitat map for Pele Island, showing coral reef and seagrass mapping outputs prepared for community review.",
    href: "/pele/Pele_coral_reef_seagrass_2026_s.pdf",
    type: "pdf",
  },
  {
    title: "Giant clam restocking areas",
    caption:
      "Village restocking map showing the giant clam restoration areas associated with Pele's community monitoring sites.",
    href: "/pele/Pele_giant_clams_2026_s.pdf",
    type: "pdf",
  },
  {
    title: "Depth and nearshore bathymetry",
    caption:
      "Depth map supporting reef interpretation, coastal exposure analysis, and wave-modelling workflows around Pele Island.",
    href: "/pele/Pele_depth_2026_s.pdf",
    type: "pdf",
  },
  {
    title: "Satellite-derived shoreline detection",
    caption:
      "Landsat-derived shoreline detection product used to inspect longer-term coastal position around Vanuatu shorelines.",
    href: "/pele/van_landsat_SDS.jpeg",
    type: "image",
  },
  {
    title: "Observed shoreline retreat",
    caption:
      "Interpreted shoreline retreat output for understanding erosion patterns and informing coastal rehabilitation planning.",
    href: "/pele/van_retreat.jpeg",
    type: "image",
  },
];

export function PeleStaticMapGallery() {
  return (
    <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm">
      <header className="flex flex-col gap-2 pb-5">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Static Map Products
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Pele Island map library</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Static map products complement the interactive Earth Engine view and provide
          print-ready references for community workshops, management planning, and review
          of restoration and coastal-risk outputs.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {STATIC_MAPS.map((item, index) => (
          <article key={item.href} className={index === 0 ? "lg:col-span-2" : undefined}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <div className="relative aspect-[16/9] bg-white">
                {item.type === "pdf" ? (
                  <object
                    data={`${item.href}#toolbar=0&navpanes=0&scrollbar=0`}
                    type="application/pdf"
                    className="h-full w-full"
                    aria-label={item.title}
                  >
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
                      This browser cannot preview the PDF map inline.
                    </div>
                  </object>
                ) : (
                  <Image
                    src={item.href}
                    alt={item.title}
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 1280px) 1120px, 100vw"
                        : "(min-width: 1280px) 540px, 100vw"
                    }
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{item.caption}</p>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border-primary/50 text-primary hover:bg-primary/10 inline-flex shrink-0 items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Open map
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
