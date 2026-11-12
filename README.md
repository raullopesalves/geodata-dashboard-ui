# Geodata Dashboard UI

[![CI](https://github.com/raullopesalves/geodata-dashboard-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/raullopesalves/geodata-dashboard-ui/actions/workflows/ci.yml)

An interactive dashboard for exploring bird flu reports across Switzerland on a map, a timeline and summary charts.

**[Live demo](https://raullopesalves.github.io/geodata-dashboard-ui/)**

I built it in September 2024 as the technical assessment for a position at ETH Zurich. The brief was to turn a geotagged CSV of bird flu reports into a dashboard someone could filter and explore.

![Dashboard overview: clustered map of Switzerland, timeline, filters and summary panel](docs/screenshots/dashboard-overview.png)

> **The data is synthetic.** All 10,000 reports in `public/fake_bird_data_switzerland_v2.csv` were generated for the assessment. Locations, species and strains are made up, and the years run from 5970 to 7437. Nothing here describes real outbreaks.

## What it does

- **Map**: shows the reports on an OpenStreetMap base map (darkened with a CSS filter), clustered by location. Each bubble's ring is split by virus strain (H5N1, H5N2, H7N2, H7N8).
- **Filters**: narrow the data by 12 bird species, 4 strains and provenance (wild or livestock). The map, timeline and summary update together.
- **Timeline**: case counts over time, grouped into 10, 50, 100 or 500 year buckets. Drag the brush or pick start and end years to set the date range for the rest of the dashboard.
- **Summary**: total cases, year range, unique species, strain trends over a chosen window, the 10 most recent reports, and pie charts of provenance and strain.

![Filtered to H5N1 in wild birds](docs/screenshots/dashboard-filtered.png)

## Stack

React 18 and TypeScript built with Vite (originally Create React App), Tailwind CSS, Leaflet with react-leaflet and marker clustering, Recharts for the timeline and pie charts, and PapaParse for reading the CSV. Tests run on Vitest.

## Design decisions

**Data stays in the browser.** The dataset is a 776 KB CSV of 10,000 rows, served as a static file and parsed once with PapaParse. At that size, filtering in memory is instant, so there is no backend to run or deploy. A much larger dataset would need parsing in a web worker, or server-side filtering and pre-aggregated tiles.

**One filter state, owned by the dashboard.** `Dashboard` holds a single `filters` object (date range, species, strains, provenance) and derives everything else with `useMemo`. Child components get data and callbacks, not their own copies of the filters. The tree is small, so there is no global store. The timeline gets data filtered by everything except the date range, so its shape doesn't collapse when you narrow the range with it.

**Derived values, not syncing effects.** The timeline's start and end years are clamped to the visible range during render rather than corrected in `useEffect`, which avoids extra renders and out-of-sync state. ESLint's React hooks rules run in CI to keep it that way.

**Map: Leaflet with one cluster layer.** Leaflet and Leaflet.markercluster handle about 7,000 points comfortably and are mature, well-documented libraries. All strains share one cluster layer, and each bubble's ring is split by strain share. An earlier version used one layer per strain, which stacked up to four bubbles on the same spot. The base map is OpenStreetMap, darkened with a CSS filter, so no API key is needed. The trade-off is a busier map than a purpose-made dark style, and OpenStreetMap's tile servers are only meant for light traffic.

**One chart library.** Recharts draws both the timeline and the pie charts. It is built from React components, and its `Brush` gives range selection on the timeline without extra code.

**Colour and accessibility.** Strains use the Okabe-Ito palette, which stays distinguishable with common colour blindness. Text colours are chosen for at least 4.5:1 contrast on the dark panels. Filter toggles expose `aria-pressed`, the help dialog is a native `<dialog>` (Esc to close, focus handled by the browser), and form controls have labels.

**Testing and CI.** Vitest and Testing Library cover the data logic (date parsing, filtering) and the main components (filter toggles, Clear filters, the empty state, totals). GitHub Actions runs lint, tests and a production build on every pull request; `main` only accepts changes through a passing PR.

## Known limitations

- Desktop-first: the three-column layout is not designed for phones.
- The dataset is synthetic, including its far-future years.

## Changes since the original submission

The assessment version is commit [`61c96c7`](https://github.com/raullopesalves/geodata-dashboard-ui/tree/61c96c7) (16 September 2024). I later revisited the project using the feedback I received:

- Replaced the failing default test with unit and component tests, and added CI.
- Fixed the production build and moved from Create React App, which is deprecated, to Vite.
- Removed non-functional UI (language picker, placeholder contact link, debug button) and unused dependencies.
- Reworked state handling in the timeline and dashboard, guided by ESLint's React hooks rules.
- Redesigned the map clusters, trend cards and recent reports; fixed a misleading drop at the end of the timeline.
- Added a live demo on GitHub Pages.

## Running it locally

You need Node.js 22 or later. The base map uses OpenStreetMap tiles, so no API key is needed.

```bash
git clone https://github.com/raullopesalves/geodata-dashboard-ui.git
cd geodata-dashboard-ui
npm install
```

Then:

```bash
npm run dev      # dev server on http://localhost:3000
npm test         # run the tests
npm run lint     # check the code with ESLint
npm run build    # production build in build/
```

## Author

Raúl Alves · [LinkedIn](https://www.linkedin.com/in/ra%C3%BAl-alves-b870a8210/) · [GitHub](https://github.com/raullopesalves)
