import Image from "next/image";
import Link from "next/link";
import type { ExternalLink, SiteProfile } from "@/types";

const genericNavigation = [
  { href: "/", label: "Dashboard" },
  { href: "/maritime", label: "Maritime" },
  { href: "/spatial", label: "Spatial" },
  { href: "/data-capture", label: "Data Capture" },
  { href: "/results-tracking", label: "Results Tracking" },
  { href: "/strategic", label: "Strategic" },
];

const isExternalUrl = (url: string) => /^https?:\/\//.test(url);

interface HeaderProps {
  profile?: SiteProfile;
  logoSrc?: string | null;
  mappingLink?: ExternalLink | null;
}

export function Header({ profile = "generic", logoSrc, mappingLink }: HeaderProps) {
  const isPele = profile === "pele";
  const navigation = isPele ? [{ href: "/", label: "Dashboard" }] : genericNavigation;
  const headerLogoSrc = isPele ? (logoSrc ?? "/pele/pielsn-logo-thumb.png") : "/goap_button.png";

  return (
    <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <Image
              src={headerLogoSrc}
              alt={isPele ? "PIELSN logo" : "Global Ocean Accounts Partnership logo"}
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium tracking-wide text-slate-500 uppercase">
              {isPele ? "PIELSN • Pele Island" : "Ocean Accounts Framework"}
            </span>
            <span className="text-xl font-semibold text-slate-900">
              {isPele
                ? "Coral Reef and Shoreline Defence Dashboard"
                : "Global Ocean Accounts Partnership"}
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-primary-soft/70 hover:text-primary rounded-full px-3 py-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isPele && mappingLink ? (
            isExternalUrl(mappingLink.url) ? (
              <a
                href={mappingLink.url}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-primary-soft/70 hover:text-primary rounded-full px-3 py-2 transition-colors"
              >
                {mappingLink.label}
              </a>
            ) : (
              <Link
                href={mappingLink.url}
                className="hover:bg-primary-soft/70 hover:text-primary rounded-full px-3 py-2 transition-colors"
              >
                {mappingLink.label}
              </Link>
            )
          ) : null}
        </nav>
      </div>
    </header>
  );
}
