import type { DashboardConfig } from "@/types";

const DEFAULT_DATA_DIRECTORY =
  process.env.NEXT_PUBLIC_DATA_PATH ??
  process.env.NEXT_PUBLIC_DATA_DIRECTORY ??
  "generic";
const DEFAULT_SITE_PROFILE =
  process.env.NEXT_PUBLIC_SITE_PROFILE === "pele" || DEFAULT_DATA_DIRECTORY === "pele"
    ? "pele"
    : "generic";
const DEFAULT_REVALIDATE_SECONDS = Number.parseInt(
  process.env.NEXT_PUBLIC_DATA_REVALIDATE ?? "3600",
  10,
);

export const dashboardConfig: DashboardConfig = {
  dataDirectory: DEFAULT_DATA_DIRECTORY,
  siteProfile: DEFAULT_SITE_PROFILE,
  revalidate: Number.isNaN(DEFAULT_REVALIDATE_SECONDS)
    ? 3600
    : DEFAULT_REVALIDATE_SECONDS,
};

export const resolveDataUrl = (resource: string, dataDir?: string): string => {
  const directory = dataDir ?? dashboardConfig.dataDirectory;
  return `/data/${directory}/${resource}`;
};

export const resolveAssetUrl = (filename: string, dataDir?: string): string =>
  resolveDataUrl(`assets/${filename}`, dataDir);
