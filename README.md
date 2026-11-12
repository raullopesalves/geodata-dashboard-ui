# Geodata Dashboard UI

[![CI](https://github.com/raullopesalves/geodata-dashboard-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/raullopesalves/geodata-dashboard-ui/actions/workflows/ci.yml)

An interactive dashboard for exploring bird flu reports across Switzerland: a clustered map, a timeline and summary charts that all respond to the same filters. Built for ETH Zurich.

**[Live demo](https://raullopesalves.github.io/geodata-dashboard-ui/)**

![Dashboard overview: clustered map of Switzerland, timeline, filters and summary panel](docs/screenshots/dashboard-overview.png)

> The data is synthetic: 10,000 generated reports with made-up locations, species and strains, dated between the years 5970 and 7437. It doesn't describe real outbreaks.

## Features

- **Map:** reports cluster by location, and each bubble's ring shows how its cases split across the four strains (H5N1, H5N2, H7N2, H7N8). Click a bubble to zoom in.
- **Filters:** 12 bird species, 4 strains and wild or livestock provenance. Every panel updates together.
- **Timeline:** cases per year, averaged over 10, 50, 100 or 500-year periods. Drag the handles or set start and end years to narrow every panel to that range.
- **Summary:** matching cases and species (such as "832 of 6,967"), trends against the previous period, the latest reports, and provenance and strain breakdowns.
- **Shareable views:** the current filters live in the URL, so a filtered view can be bookmarked or sent, e.g. [`?strains=H5N1&provenance=Wild&from=6500&to=7000`](https://raullopesalves.github.io/geodata-dashboard-ui/?strains=H5N1&provenance=Wild&from=6500&to=7000).
- **Works on any screen:** a three-column dashboard from 1280 px wide; below that, the panels stack and the page scrolls.
- **Accessible:** keyboard-reachable map clusters and controls, screen-reader labels and announcements, colour-blind-safe colours, and support for reduced motion.

![Filtered to H5N1 in wild birds](docs/screenshots/dashboard-filtered.png)

## Tech stack

React 19 and TypeScript, built with Vite. Tailwind CSS 4 for styling, Leaflet with react-leaflet and Leaflet.markercluster for the map, Recharts for the charts, and PapaParse for the CSV. Tests use Vitest and Testing Library.

## How it works

- **Data in the browser.** The 776 KB CSV is a static file, parsed once on load. At this size, filtering in memory is instant, so there is no backend. A much larger dataset would call for parsing in a web worker or filtering on a server.
- **One source of truth for filters.** `Dashboard` owns a single filter state (date range, species, strains, provenance) and derives everything else with `useMemo`. The timeline gets data filtered by everything except the date range, so its shape stays put while you narrow the range with it.
- **Derived values over syncing effects.** Values such as the timeline's clamped years are computed during render instead of being patched up in `useEffect`. ESLint's React hooks rules enforce this in CI.
- **Fair timeline.** The first and last periods only partly overlap the data, so the chart plots cases per year rather than raw totals, which would show a false dip at both ends.
- **Map without an API key.** The base map is standard OpenStreetMap tiles darkened with a CSS filter. OpenStreetMap's tile servers are meant for light use; a high-traffic deployment would need its own tile provider.
- **Colour.** Strains use the Okabe-Ito palette, which stays distinguishable with common colour blindness, and text keeps at least 4.5:1 contrast on the dark panels.

## Getting started

Requires Node.js 22 or later. No API keys or environment variables are needed.

```bash
git clone https://github.com/raullopesalves/geodata-dashboard-ui.git
cd geodata-dashboard-ui
npm install
npm run dev
```

The dev server runs on http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run the tests |
| `npm run lint` | Check the code with ESLint |
| `npm run build` | Type-check and build for production into `build/` |
| `npm run preview` | Serve the production build locally |

Every pull request runs lint, tests and a production build in GitHub Actions. Merges to `main` deploy to GitHub Pages.

## Project structure

```
src/
  components/                Dashboard, map, timeline, filters, header and footer
    dataSummaryComponents/   Summary panel: totals, trends, recent reports, pies
  utils/                     CSV parsing and filtering, URL filter state, motion preference
  constants/colors.ts        Strain and provenance colours
public/                      The CSV and icons
```

## Author

Raúl Alves · [LinkedIn](https://www.linkedin.com/in/ra%C3%BAl-alves-b870a8210/) · [GitHub](https://github.com/raullopesalves)
