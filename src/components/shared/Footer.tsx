import Image from "next/image";
import type { NarrativeFooter, SiteProfile } from "@/types";

interface FooterProps {
  footer: NarrativeFooter;
  profile?: SiteProfile;
  logoSrc?: string | null;
}

export function Footer({ footer, profile = "generic", logoSrc }: FooterProps) {
  const isPele = profile === "pele";

  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">{footer.attribution}</p>
          <p className="text-slate-500">{footer.dataSourceCitation}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 md:flex-nowrap md:justify-end">
          {isPele && logoSrc ? (
            <div className="relative h-28 w-36" role="img" aria-label="PIELSN">
              <Image
                src={logoSrc}
                alt="PIELSN logo"
                fill
                sizes="144px"
                className="object-contain"
              />
            </div>
          ) : null}
          {!isPele ? (
            <>
              <a
                href="https://www.unsw.edu.au/research/centre-for-sustainable-development-reform"
                target="_blank"
                rel="noreferrer"
                className="relative h-32 w-32"
                aria-label="Centre for Sustainable Development Reform"
              >
                <Image
                  src="/csdr.png"
                  alt="Centre for Sustainable Development Reform logo"
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </a>
              <a
                href="https://www.oceanaccounts.org/"
                target="_blank"
                rel="noreferrer"
                className="relative h-32 w-32"
                aria-label="Global Ocean Accounts Partnership"
              >
                <Image
                  src="/goap.png"
                  alt="Global Ocean Accounts Partnership logo"
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </a>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
