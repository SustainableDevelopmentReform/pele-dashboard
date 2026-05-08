import type { EcosystemKey } from "@/types";

export const ECOSYSTEM_LABELS: Record<EcosystemKey, string> = {
  coralReef: "Coral Reef",
  reefFlats: "Reef Flats",
  seagrass: "Seagrass",
  mangroves: "Mangroves",
  algae: "Algae",
  tidalWetlands: "Tidal Wetlands",
  other: "Other",
  rubbleBrokenCoral: "Rubble/broken coral",
  sand: "Sand",
  pavement: "Pavement",
  rubble: "Rubble",
  denseSeagrass: "Dense seagrass",
  lightSeagrass: "Light seagrass",
};

export const ECOSYSTEM_COLORS: Record<EcosystemKey, string> = {
  coralReef: "#e85d75",
  reefFlats: "#FFE4B5",
  seagrass: "#228B22",
  mangroves: "#00FF00",
  algae: "#8B4513",
  tidalWetlands: "#FFB6C1",
  other: "#94a3b8",
  rubbleBrokenCoral: "#caa06a",
  sand: "#f1dca7",
  pavement: "#8f98a3",
  rubble: "#5f6872",
  denseSeagrass: "#176f48",
  lightSeagrass: "#7dbb6f",
};

export const ECOSYSTEM_ORDER: EcosystemKey[] = [
  "coralReef",
  "reefFlats",
  "seagrass",
  "mangroves",
  "algae",
  "tidalWetlands",
  "other",
  "rubbleBrokenCoral",
  "sand",
  "pavement",
  "rubble",
  "denseSeagrass",
  "lightSeagrass",
];

export const CONFIDENCE_LABELS: Record<string, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

export const DEFAULT_REVALIDATE_SECONDS = 3600;
