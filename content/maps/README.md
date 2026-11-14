# Maps

Source files for 2010s-style GPS maps: a Garmin track drawn over an ArcGIS-looking basemap, made virtually instead of by walking with a device.

## Folders

- `tracks/` hand-drawn routes as `.gpx` (one file per route, e.g. `simmons-to-bexley.gpx`)
- `exports/` finished map images (PNG/SVG) ready to copy into `public/img/`

## Workflow

### 1. Draw the track (fake the Garmin)

Use [gpx.studio](https://gpx.studio) (free, browser-based):

1. Click along streets to draw the route. It snaps to roads/paths.
2. Add waypoints for places (dorms, tunnels, stairwells). Name them in caps, Garmin style: `SIMMONS`, `BLDG 7`.
3. Optional realism: set a start time and speed so each point gets a timestamp. This is what makes it a real "track log".
4. Export as GPX into `tracks/`.

A GPX file is the same format a Garmin eTrex or Forerunner wrote, so every GIS tool reads it.

### 2. Style it like 2010s ArcGIS

Pick one:

**Option A: QGIS (free desktop, closest to real ArcGIS)**
1. Install [QGIS](https://qgis.org).
2. Layer > Add Layer > Add Vector Layer > pick the `.gpx`. Load `tracks` and `waypoints`.
3. Basemap: install the QuickMapServices plugin, add "ESRI World Topo" or "ESRI World Imagery". These are the actual 2010s ArcGIS Online basemaps.
4. Track symbology: 2-3px solid line in magenta (`#ff00ff`) or Garmin red. Waypoints: small flag or square markers, labels in a narrow sans (Arial Narrow / Tahoma).
5. Project > New Print Layout. Add map, scale bar, north arrow, legend. Export PNG/SVG to `exports/`.

**Option B: In the site (interactive, later)**
Render the GPX directly in a page with Leaflet or MapLibre plus Esri's tile layers. Parse GPX in the browser with `@tmcw/togeojson`. Good if the map should pan/zoom alongside a chapter.

## Period details that sell the look

- Esri World Topo or World Street Map basemap (the beige/olive palette)
- Magenta or red breadcrumb track, sometimes with small arrowheads for direction
- Scale bar in both feet and meters, a plain north arrow
- Legend box with a thin black border
- Coordinates in degrees-decimal-minutes (`N 42° 21.476'`), the Garmin default
- Optional elevation profile under the map (QGIS Profile Tool plugin)
