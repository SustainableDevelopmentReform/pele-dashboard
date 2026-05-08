# Pele Island Dashboard — Redesign & Implementation Plan

Source brief: [instructions/design-breif.pdf](design-breif.pdf)
Working framework: generic GOAP Ocean Accounts Dashboard (Next.js 14 / React 18 / TS / Tailwind / D3 / MapLibre).

## 0. Guiding principles (from the brief)

The brief is a "what to keep" overlay on the generic template. Anything not explicitly retained should be **hidden**, not deleted, so the framework remains intact for other deployments and for re-enabling content if Pele requirements expand.

- **Hide, don't delete** — gate all unwanted modules behind a Pele-specific config/flag (or a `pele` data directory) so generic deployments continue to work unchanged.
- **Data-driven** — keep using the existing "data presence = feature on" pattern. New Pele-specific data (restocking, coastal risk) should sit in their own JSON files that activate new components.
- **Custom classes, custom palette** — Pele uses a different benthic class set (Coral Reef, Rubble/broken coral, Sand, Pavement, Rubble, Dense seagrass, Light seagrass) than the generic template (`coralReef`, `reefFlats`, `seagrass`, `mangroves`, `algae`, `tidalWetlands`). The class list, colours, labels and ordering need a Pele-scoped extension to `EcosystemKey`.
- **Open-source GEE Apps** — replace internal spatial/MapLibre links with the public Pele GEE App where the brief asks for it.

---

## 1. Deployment configuration

Use the existing data-directory mechanism rather than forking the codebase.

1. Create `public/data/pele/` (mirrors `public/data/generic/`).
2. Set `NEXT_PUBLIC_DATA_DIRECTORY=pele` (read by [src/lib/config.ts](../src/lib/config.ts) → [src/lib/dataLoader.ts](../src/lib/dataLoader.ts#L31-L52)).
3. Add a Pele-specific deployment branch and Amplify environment per [instructions/deployment_guide.md](deployment_guide.md).
4. Introduce a `siteProfile` (e.g. `"generic" | "pele"`) read from env or from a new `public/data/pele/site.json`. The home page ([src/app/page.tsx](../src/app/page.tsx)) reads it and conditionally renders / hides sections so the generic template is unaffected.

---

## 2. Page-by-page change map

The dashboard home page ([src/app/page.tsx](../src/app/page.tsx)) currently renders ten sections. The Pele layout shrinks this to six sections in a fixed order:

1. Hero / title
2. Pele ocean ecosystem extent (national equivalent)
3. Compare across coastal areas
4. **NEW** Coastal risk extent and shoreline defence
5. **NEW** Giant clam / Green snail restocking areas
6. Changes over time (benthic cover, then shoreline position)
7. Services value across ecosystem types (extent + population use)
8. Social Indicators & Profiles (unchanged)
9. Conservation and Future Outlook + Data Sources & Methodology (rewritten copy)

Sections to hide for the Pele profile:
- `EconomicHighlights` ([src/components/dashboard/EconomicHighlights.tsx](../src/components/dashboard/EconomicHighlights.tsx))
- `NaturalCapitalSection` ([src/components/dashboard/NaturalCapitalSection.tsx](../src/components/dashboard/NaturalCapitalSection.tsx))
- `MaritimeDashboard` ([src/components/maritime/MaritimeDashboard.tsx](../src/components/maritime/MaritimeDashboard.tsx))
- All header nav items except Dashboard (and possibly Spatial if Pele wants the layered map; otherwise replace with external GEE App link).

Sections that need the largest content/structural changes are detailed in §4 below.

---

## 3. Header & navigation ([src/components/shared/Header.tsx](../src/components/shared/Header.tsx))

- For `siteProfile === "pele"`, replace the GOAP brand block with a Pele wordmark + PIELSN badge (small).
- Reduce navigation to a single item ("Dashboard"). Optionally keep an external link out to the Pele GEE App in the nav.
- Keep the existing `<Header />` markup for the generic profile.

Implementation: pass a `profile` prop into `<Header />` and branch the `navigation` array + brand block. Keep colour tokens identical so other pages (if ever re-enabled) continue to work.

---

## 4. Section-by-section redesign

### 4.1 Hero / Title (replaces [HeroSection](../src/components/dashboard/HeroSection.tsx))

| Brief requirement | Implementation |
|---|---|
| Title → "Pele Island Coral Reef and Shoreline Defence Information Dashboard" | New `narrative.introduction.title` in `public/data/pele/narrative.json`. |
| Remove blue "Ecosystem Extent Snapshot" card; replace with PIELSN logo | Branch in `HeroSection.tsx`: when `profile === "pele"`, render `<Image src="/pele/pielsn-logo.png" />` in the right-hand slot instead of the snapshot card. Logo asset goes to `public/pele/pielsn-logo.png`. |
| Replace body text | Drop the Pele body copy verbatim into `narrative.introduction.content` — it already passes through `ReactMarkdown`. The brief copy mentions all four villages (Worasiviu, Launamo, Piliura, Worearu) and the AI/drone/wave-modelling stack; ensure markdown line breaks are preserved. |
| Beta badge / "GOAP • Ocean Accounts Dashboard" eyebrow | Hide for Pele (or re-label as "PIELSN • Pele Island"). |

No new component needed — adjust `HeroSection.tsx` to take a `profile` prop and a `logoSrc` so Pele branding is pure config.

### 4.2 Pele Ocean Ecosystem Extent (replaces [NationalEcosystemAccount](../src/components/dashboard/NationalEcosystemAccount.tsx) + [EcosystemDonutChart](../src/components/dashboard/EcosystemDonutChart.tsx) + [EcosystemConditionCard](../src/components/dashboard/EcosystemConditionCard.tsx))

The class taxonomy is the biggest change. Required Pele classes:

- Coral Reef (with condition)
- Rubble/broken coral (no condition)
- Sand (no condition)
- Pavement (no condition)
- Rubble (no condition)
- Dense seagrass (with condition)
- Light seagrass (with condition — implied; brief doesn't say "no condition" for it)

Implementation:

1. **Type system.** Extend `EcosystemKey` in [src/types/index.ts](../src/types/index.ts#L3-L10) with new keys: `rubbleBrokenCoral`, `sand`, `pavement`, `rubble`, `denseSeagrass`, `lightSeagrass`. Keep generic keys for backwards compatibility — neither side breaks.
2. **Constants.** Extend `ECOSYSTEM_LABELS`, `ECOSYSTEM_COLORS`, `ECOSYSTEM_ORDER` in [src/lib/constants.ts](../src/lib/constants.ts) with the new keys. Pick a Pele-appropriate palette (consistent across donut, cards, and changes-over-time line chart). Suggested anchors: coral=coral pink/red, rubble/broken coral=warm tan, sand=light beige, pavement=mid grey, rubble=darker grey, dense seagrass=deep green, light seagrass=light green.
3. **Featured set.** In `NationalEcosystemAccount.tsx`, replace the hard-coded `FEATURED_ECOSYSTEMS = ["coralReef", "reefFlats", "seagrass", "mangroves"]` with a configurable list driven from data (e.g. `national.featuredEcosystems`) so generic + Pele each get their right cards.
4. **Condition copy.** `EcosystemConditionCard.tsx` already takes a `conditionLabel`. Drive it from data: the new `national.json` ecosystem entries gain optional `conditionLabel`. For Pele, omit `conditionLabel` for `sand`, `pavement`, `rubble`, and `rubbleBrokenCoral`; the card collapses the condition row when absent (small render change).
5. **Units.** Brief asks "Area measurements might be better as m² for Pele?". Add an optional `national.areaUnit: "ha" | "m2"` (default `"ha"`); thread it through `formatNumber` calls in the ecosystem cards, donut centre, and area-selector card. **Decision needed before build** — see §8.
6. **Donut.** No structural change — once the class list is data-driven (steps 1–3), the donut renders the new classes automatically.

### 4.3 Compare ecosystem extent across mapped areas ([AreaSelector](../src/components/dashboard/AreaSelector.tsx))

| Brief requirement | Implementation |
|---|---|
| Title → "Compare ecosystem extent across Pele Island coastal areas" | Static string change behind the `profile` branch (or move to a `narrative.areaSelector.title` field). |
| Dropdown: replace "Alpha Isle" with three Pele coastal sectors | Replace `subnational.areas[]` in `public/data/pele/subnational.json` with three areas: `west-coast` ("West coast – tide dominated"), `east-coast` ("East coast – wave dominated"), `south-coast` ("South coast – mixed"). Each carries the new Pele class breakdown. |
| Classes match the new ecosystem set | Falls out of §4.2 type/constants work. |
| Replace "Open in spatial view" link → "Open mapping view" → Pele GEE App | Make the link target & label data-driven. Add `subnational.spatialLink: { label, url }` to subnational data; default label remains "Open in spatial view"; Pele config sets it to the GEE URL. The `<Link href={...}>` becomes a regular `<a target="_blank" rel="noreferrer">` when the URL is external. |
| Possibly m² | Same flag as §4.2.5. |

The "View in spatial explorer" links inside the per-area card should also become external GEE links for Pele (or be hidden).

### 4.4 Coastal risk extent and shoreline defence (NEW)

This box is a **new** section, modelled on the title/extent style of the National Ecosystem Account. Build a `CoastalRiskExtent` component that:

- Renders a header matching the "Ocean Ecosystem Extent" type ramp ("ECOSYSTEM EXTENT ACCOUNT" eyebrow + h2).
- Shows a placeholder body when no data is supplied yet (Dan still pending).
- Accepts a button-link prop to a static map / GEE App (matching the styling of "Open mapping view" in §4.3).
- File: `src/components/dashboard/pele/CoastalRiskExtent.tsx`.
- Data file: `public/data/pele/coastal-risk.json` with shape (initial draft):
  ```json
  {
    "title": "Coastal risk extent and shoreline defence",
    "description": "...",
    "metrics": [],
    "mapLink": { "label": "Open mapping view", "url": "..." }
  }
  ```
- Hidden when the JSON is absent (matches the framework's "data presence = feature on" pattern).

Stub now; populate when Dan delivers outputs.

### 4.5 Giant clam (and Green snail) restocking areas (replaces [PriorityMonitoringAreas](../src/components/dashboard/PriorityMonitoringAreas.tsx))

Brief: replicate the priority-monitoring card style but show four cards (one per village: Worasiviu, Launamo, Piliura, Worearu), with a per-card 3-row stat block, a year-selector dropdown for restocking surveys, and a top-level toggle/replicate for Green snail.

Implementation:

1. New component `src/components/dashboard/pele/RestockingAreas.tsx` ("use client" — needs a year selector and species toggle).
2. New data file `public/data/pele/restocking.json`:
   ```json
   {
     "species": [
       {
         "id": "giant-clam",
         "label": "Giant clam restocking areas",
         "displayName": "Giant clam",
         "sites": [
           {
             "id": "worasiviu",
             "village": "Worasiviu",
             "coordinates": {...},
             "surveys": [
               {
                 "year": 2025,
                 "clamsPlaced": 250,
                 "speciesAndSize": "T. derasa, 4–6 cm",
                 "restockingDate": "2025-08-15",
                 "survivalRate6mo": 0.78,
                 "notes": "..."
               }
             ]
           },
           ...four villages...
         ],
         "mapImage": "/pele/restocking-static-map.png"
       },
       {
         "id": "green-snail",
         "label": "Green snail restocking areas",
         ...
       }
     ]
   }
   ```
3. Component behaviour:
   - Top-level: species selector (radio chips or `<select>`) → switches the title and the dataset (defaults to giant clam).
   - Grid of four village cards (matches the existing `<article>` styling in `PriorityMonitoringAreas.tsx` — reuse Tailwind classes for visual continuity).
   - Each card shows the village name, a coordinates/short description line, a `<dl>` with three rows: **Number of clams placed**, **Species and size**, **Date of restocking and survival rate 6 months later** ("`{date}` • `{rate}` survival").
   - Per-card year `<select>` populated from `surveys[].year` for that site; default to most recent. Re-renders the `<dl>` for the chosen survey year.
   - A single "View static map" button under the grid (or per-card if Dan provides per-village maps) using the brief's static map image.
4. Drop the "Capital / Study Site / Study Site" sub-titles entirely.

### 4.6 Changes over Time (replaces [TimeSeriesChart](../src/components/dashboard/TimeSeriesChart.tsx))

| Brief requirement | Implementation |
|---|---|
| Section title "Temporal Trends" → "Changes over Time" | Static change behind `profile` branch. |
| Ecosystem dropdown label → "benthic cover" | Change `<label>` text. |
| Match line chart colour to class colour | Today the line is hard-coded `#0077be` ([TimeSeriesChart.tsx#L193](../src/components/dashboard/TimeSeriesChart.tsx#L193)). Look up the active series via `ECOSYSTEM_COLORS[seriesKey]` and pass through. The `TimeSeriesSeries.name` already matches the `EcosystemKey` ids in the generic data — keep that contract for Pele. |
| Total in m² over time | Same unit decision as §4.2.5 (`timeseries.unit` is already a field). Add a derived total series (sum of all benthic classes per year) and either show it as the default option or as an additional "Total benthic cover" item in the dropdown. |
| Future: replicate for shoreline position vs IPCC SLR scenarios | Out of scope for first build — leave a TODO comment in the new section explaining the intended follow-up component (`ShorelineChangeChart`) and reuse 90% of `TimeSeriesChart`. |
| Delete next box → Economic Highlights | Hide via `profile` branch in `page.tsx`. |

### 4.7 Services value across ecosystem types ([NationalEcosystemServicesAccount](../src/components/dashboard/NationalEcosystemServicesAccount.tsx))

| Brief requirement | Implementation |
|---|---|
| Keep the "Extent" metric card | No change — it already comes from `national.ecosystemServices.metrics[].id === "area"`. |
| Rename "Ecosystem service value" → "Population use" | Rename the metric `label` to "Population use" in `public/data/pele/national.json`. Update its `unit` (e.g. `"islanders"` or `"villagers"`). The `ServiceMetricCard` reads `metric.label` directly. |
| "Population use" semantics | Number of islanders that use each ecosystem (or per village). For per-village, extend `EcosystemServiceMetric` with optional `breakdown: Array<{ village: string; value: number }>` and update `ServiceMetricCard` to optionally render a small inline breakdown when present. |
| Condition index: how is it calculated? | Either drop the metric for Pele or keep with explicit methodology text in `services.metadata.methodology`. **Decision needed** — flag in §8. |
| Tabu / open access / mixed-use proportions | Future enhancement: add an optional `accessBreakdown` per ecosystem (`{ tabu: %, openAccess: %, mixedUse: %}`) and render as a stacked bar inside the section. Defer to Phase 2 of the Pele build. |
| Delete next box → Natural Capital | Hide via `profile` branch in `page.tsx`. |

### 4.8 Social Indicators & Profiles ([SocialDashboard](../src/components/dashboard/social/SocialDashboard.tsx))

Brief: "looks great too! I'll chat to Willie and Salome about this box. Keep as is for now."

- No code changes.
- Populate `public/data/pele/socioeconomic.json` with the four Pele villages once Willie/Salome confirm the indicators. Until then, the socioeconomic loader is optional and the section auto-hides.
- Delete every section between this and Conservation/Future Outlook → already covered by hiding `EconomicHighlights`, `NaturalCapitalSection`, `MaritimeDashboard` in the `profile === "pele"` branch.

### 4.9 Conservation and Future Outlook + Data Sources and Methodology ([NarrativeSections](../src/components/dashboard/NarrativeSections.tsx))

- Keep `NarrativeSections` as-is; rewrite `public/data/pele/narrative.json`:
  - `sections[0]` (or whichever `order`): **Conservation and Future Outlook** — keep until Salome/Willie revise (placeholder copy from the generic template is fine for now).
  - `sections[1]`: **Data Sources and Methodology** — replace `content` with the long brief copy describing the four data sources (Field Survey Data, Drone Data, Satellite Imagery, Wave & Oceanographic Data). Use markdown bold for the source headings — `ReactMarkdown` already renders it.
- Remove the existing `economic-flow` (Sankey) section by omitting it from `narrative.json`.
- Footer ([src/components/shared/Footer.tsx](../src/components/shared/Footer.tsx)) — re-attribute to PIELSN / partners.

---

## 5. New & changed files (summary)

**New files**
- `public/data/pele/` — `national.json`, `subnational.json`, `timeseries.json`, `narrative.json`, `socioeconomic.json`, `coastal-risk.json`, `restocking.json`, `site.json`, plus a copied/empty `economic.json` and `spatial.json` (or stubs that satisfy the schema; the loader currently `Promise.all`s them).
- `public/pele/pielsn-logo.png`, `public/pele/restocking-static-map.png` (assets).
- `src/components/dashboard/pele/CoastalRiskExtent.tsx`
- `src/components/dashboard/pele/RestockingAreas.tsx`
- `schemas/coastal-risk.schema.json`, `schemas/restocking.schema.json` (mirror existing schema folder for `pnpm run validate-data`).

**Modified files**
- [src/types/index.ts](../src/types/index.ts) — extend `EcosystemKey`; add `featuredEcosystems`, `areaUnit`, `spatialLink`, optional restocking & coastal-risk types.
- [src/lib/constants.ts](../src/lib/constants.ts) — extend `ECOSYSTEM_LABELS / COLORS / ORDER` with the new Pele classes.
- [src/lib/dataLoader.ts](../src/lib/dataLoader.ts) — add `loadCoastalRisk`, `loadRestocking`, `loadSiteProfile` loaders; include them in the `Promise.all`.
- [src/lib/config.ts](../src/lib/config.ts) — surface `siteProfile`.
- [src/app/page.tsx](../src/app/page.tsx) — branch on `siteProfile`; render the Pele section order; hide Economic / Natural Capital / Maritime when `pele`.
- [src/components/shared/Header.tsx](../src/components/shared/Header.tsx) — accept `profile` prop, branch nav + brand block.
- [src/components/dashboard/HeroSection.tsx](../src/components/dashboard/HeroSection.tsx) — accept `profile` & `logoSrc`; swap snapshot card for logo when Pele.
- [src/components/dashboard/NationalEcosystemAccount.tsx](../src/components/dashboard/NationalEcosystemAccount.tsx) — drive `FEATURED_ECOSYSTEMS` from data.
- [src/components/dashboard/EcosystemConditionCard.tsx](../src/components/dashboard/EcosystemConditionCard.tsx) — collapse condition row when `conditionLabel == null`.
- [src/components/dashboard/AreaSelector.tsx](../src/components/dashboard/AreaSelector.tsx) — make spatial link data-driven (internal `Link` vs external `<a>`).
- [src/components/dashboard/TimeSeriesChart.tsx](../src/components/dashboard/TimeSeriesChart.tsx) — derive line colour from `ECOSYSTEM_COLORS`; rename label/title via props/data; optionally add "Total" series.
- [src/components/dashboard/services/ServiceMetricCard.tsx](../src/components/dashboard/services/ServiceMetricCard.tsx) — render optional `breakdown` array.
- [src/components/shared/Footer.tsx](../src/components/shared/Footer.tsx) — re-attribute for Pele.

**Hidden (no code change beyond the `profile` branch in `page.tsx`)**
- `EconomicHighlights`, `NaturalCapitalSection`, `MaritimeDashboard`, generic header nav items.

---

## 6. Implementation order (suggested phases)

**Phase A — Plumbing (1 dev-day)**
1. Add `siteProfile` to config + loader.
2. Create `public/data/pele/` by copying `generic/` and stubbing required JSONs.
3. Branch `page.tsx` to render only the kept sections under `profile === "pele"`. Verify generic dashboard still builds.

**Phase B — Class taxonomy (1 day)**
1. Extend `EcosystemKey`, `ECOSYSTEM_LABELS / COLORS / ORDER`, `EcosystemBreakdown`.
2. Drive `FEATURED_ECOSYSTEMS` from data; collapse missing condition rows.
3. Update `public/data/pele/national.json` and `subnational.json` to use the Pele class set with placeholder values.
4. Run `pnpm run validate-data pele` (extend the validator if necessary to allow the new keys).

**Phase C — Hero, Areas, Changes-over-time (1–2 days)**
1. Hero copy + PIELSN logo + branded header.
2. Area selector renaming + GEE App link wiring.
3. Time-series rename + per-class colour matching + optional totals series.

**Phase D — Pele-specific sections (2–3 days)**
1. `RestockingAreas` component + `restocking.json` + static map asset.
2. `CoastalRiskExtent` placeholder component + `coastal-risk.json` stub + GEE link slot (awaiting Dan).
3. Services section: rename to "Population use", add per-village breakdown rendering hook (data optional).

**Phase E — Narrative & Footer (0.5 day)**
1. Replace narrative content for Data Sources & Methodology and Conservation & Future Outlook.
2. Footer attribution.

**Phase F — QA (1 day)**
1. `pnpm run lint` / `type-check` / `test` / `validate-data pele` / `build`.
2. Manual UI walkthrough at three breakpoints.
3. Verify generic deployment unaffected (`NEXT_PUBLIC_DATA_DIRECTORY=generic` build).

---

## 7. Risks & open questions

- **Data validator** ([scripts/validate-data](../scripts) – verify location). The current schemas hard-list ecosystem keys — they need updating in lockstep with the Pele extensions or the validator will reject the Pele JSON.
- **Spatial schema** still expects `boundaries.national + subnational + locations`. If we don't ship a Pele-specific MapLibre map (because we're sending users to the GEE App), provide minimal stub geometries or make the spatial loader optional.
- **Tests**. Existing snapshot/unit tests assert generic class names and copy. Extend them for the Pele profile rather than mutate the generic ones.
- **Backwards compat**. Avoid removing generic ecosystem keys from `EcosystemKey`; only **add** new keys.
- **m² vs ha**. Pele extents may be small enough that ha → m² is preferable, but the time-series and donut totals should use the same unit. **Pick one before populating data.**
- **Condition index methodology** for the services box — keep, drop, or rewrite. Awaiting input.
- **Per-village vs per-ecosystem "Population use"** — confirm with Salome/Willie before designing the breakdown rendering.

---

## 8. Decisions needed before build

| # | Decision | Default if undecided |
|---|---|---|
| D1 | Area unit: ha or m²? | Keep `ha` (no change required). |
| D2 | Drop the GOAP brand entirely or co-brand with PIELSN? | Co-brand: PIELSN primary, GOAP secondary in footer. |
| D3 | Header nav: Dashboard-only, or also expose Spatial / external GEE link? | Dashboard + external "Open mapping view" link. |
| D4 | "Population use" — per ecosystem total only, or with per-village breakdown? | Per ecosystem total now; per-village breakdown ships when data is ready. |
| D5 | Condition Index in services box — keep, drop, or restate methodology? | Drop until methodology confirmed. |
| D6 | Should the four village cards in §4.5 share a single static map or one per village? | Single shared static map below the grid. |
| D7 | Green snail restocking — separate replicated section or in-place species toggle? | In-place toggle (one section, switchable species). |

---

## 9. Out of scope for first delivery

- Shoreline-position-vs-IPCC SLR chart (waiting on Dan).
- Tabu / open-access / mixed-use proportional breakdown for services.
- Per-village "Population use" breakdown (data not yet collected).
- Multi-language / translation support for Pele content.
- Re-enabling Maritime, Data Capture, Results Tracking, Strategic pages — deferred indefinitely; pages remain in the codebase but are unreachable from the Pele header.
