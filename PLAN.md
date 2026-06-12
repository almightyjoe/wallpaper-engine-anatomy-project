# Development Plan — Wallpaper Engine Anatomy Project

This doc is the handoff/continuation reference for picking up development from
another device (e.g. Claude Code on phone). Read this first, then `README.md`
for structure/usage details.

## Goal

An interactive, medically-accurate human anatomy wallpaper for Wallpaper Engine
(Steam). Runs as static HTML/CSS/JS via `file://` — no server, no backend —
so it's portable and publishable to the Workshop and shareable via GitHub.

Core interactions:
1. **Layer toggles** — sidebar buttons (and matching Wallpaper Engine
   properties) show/hide anatomical systems: skeletal, organs, circulatory,
   nervous, muscular, skin.
2. **Region zoom (planned)** — clicking a body region (head, torso, arms,
   legs) or an organ (heart, liver, lungs, etc.) will eventually open a
   zoomed-in "scene" of that area with its own layered, toggleable anatomy.

## Current status (as of this commit)

Done:
- Repo scaffolded and pushed to `https://github.com/almightyjoe/wallpaper-engine-anatomy-project`
- `project.json` — Wallpaper Engine manifest with layer-visibility properties
  + sidebar position + show-labels options
- `index.html` / `css/style.css` / `js/main.js` — full-body view with:
  - 6 stacked anatomy layers, now using **real open-licensed medical
    illustrations** (see `assets/layers/SOURCES.md`), rendered as `<img>`
    elements with `object-fit: contain`
  - A separate transparent **hotspot overlay** (`assets/layers/hotspots.svg`)
    sits above all layers and provides the clickable/hoverable
    `data-region` targets (head, torso, arms, legs, heart, lungs, liver,
    stomach, intestines, kidneys, brain)
  - Sidebar with color-coded toggle buttons, wired to layer visibility
  - Wallpaper Engine `applyUserProperties` listener mirrors WE property panel to the UI
  - Clicking a hotspot opens a placeholder info panel (region label + description)
- `js/layers-config.js` — central layer registry (order, file, label, color,
  WE property id, plus `scale`/`offsetY` per-layer alignment fudge factors)
- `js/regions-config.js` — central region registry (id, label, description, future `scene` link)
- `assets/layers/*.svg` — real anatomy art for skeletal, organs, circulatory,
  nervous, muscular, skin (sources/licenses in `assets/layers/SOURCES.md`)
- Verified via headless preview: all 6 layer images load, sidebar toggles
  show/hide layers, hotspot click opens the info panel with correct content

Not done / known gaps:
- **Layer alignment is approximate.** The 6 source images come from different
  projects/styles with different aspect ratios (~0.375 to ~0.714) and poses —
  see `assets/layers/SOURCES.md` for the full breakdown. `#layer-stack` uses
  the "muscular" layer's 1000x1400 size as the alignment anchor; other layers
  use `object-fit: contain` plus a per-layer `scale`/`offsetY` in
  `js/layers-config.js` as a rough first pass. **Needs visual recalibration**
  — toggle layers on/off and tune `scale`/`offsetY` until heads/torsos/limbs
  line up acceptably.
- Hotspot positions in `assets/layers/hotspots.svg` are estimated for a
  generic standing figure on the 1000x1400 anchor canvas — recheck/adjust
  once layer alignment is finalized.
- Visual style is inconsistent across layers (sepia engraving skeleton vs.
  flat-color muscular vs. schematic circulatory/nervous). Cosmetic; consider
  unifying (recoloring, consistent line weight) once alignment is solid.
- Region clicks only show an info panel — no actual zoom/scene swap yet
- No preview image for Workshop publishing yet (`assets/preview/` is empty)
- No automated tests; verified via local static server + headless preview eval

## Roadmap (priority order)

### Phase 1b — Calibrate layer alignment (highest priority, do this next)
- Real art is in place (`assets/layers/*.svg`, see `SOURCES.md`), but the 6
  images don't share a coordinate system. Work through `js/layers-config.js`:
  - Toggle one layer at a time (plus "skin" as a size reference) and adjust
    that layer's `scale` (multiplier) and `offsetY` (CSS `%`, applied as
    `translateY`) until the figure's head/shoulders/hips/feet roughly line up
    with the others
  - `muscular` (1000x1400) is the anchor — leave its `scale: 1, offsetY: 0`
  - Likely needing the biggest adjustments: `skin` (480x1280, very
    tall/narrow) and `nervous` (272x597, tall/narrow) — both currently have a
    starting `scale` bump but will need more tuning
  - After alignment improves, re-check `assets/layers/hotspots.svg` hotspot
    positions against the now-aligned art and adjust coordinates
- Optional cosmetic pass: harmonize colors/line-weight across layers once
  alignment is acceptable (skeletal is sepia-engraving style vs. flat-color
  others)

### Phase 2 — Region zoom / scenes
- Design the "scene" format: a scene = its own mini layer-stack + sidebar,
  scoped to one body part, reusing `ANATOMY_LAYERS`/sidebar code where possible
- Add `scenes/<id>/` folders (e.g. `scenes/torso/`) each with their own SVG
  layers (e.g. ribcage, heart, lungs, major vessels at higher zoom) plus a
  small config mirroring `layers-config.js`
- Wire `js/main.js#loadRegionScene(sceneId)`:
  - Swap `#layer-stack` contents to the scene's layers
  - Show a "back to full body" control
  - Re-point the sidebar toggle list at the scene's layer config
- Update `ANATOMY_REGIONS` entries (`js/regions-config.js`) to point `scene`
  at the new scene id once built (start with `torso` → heart/lungs zoom as
  the first scene, since organs/circulatory/nervous placeholders already tag
  those parts)

### Phase 3 — Polish & publish
- Add Workshop preview image/video to `assets/preview/`
- Add a short in-wallpaper legend/credits (sources for anatomy art, licenses)
- Test end-to-end inside Wallpaper Engine's editor (Editor → New Wallpaper →
  Web → point at `index.html`); confirm property panel toggles work live
- Publish to Workshop via Wallpaper Engine's built-in publish flow
- Keep GitHub repo in sync (this is independent of the Workshop upload)

## Working conventions

- Keep everything static (`file://` compatible) — no server-side code, no
  build step required to run. A static server (see `.claude/launch.json`,
  `python -m http.server`) is only for local dev/testing, not shipped.
- Anatomy layer images don't need a shared internal viewBox — alignment is
  handled per-layer via `scale`/`offsetY` in `js/layers-config.js` against the
  `#layer-stack` anchor (1000x1400, see `css/style.css`).
- Region tagging convention: clickable `data-region="<name>"` shapes live in
  `assets/layers/hotspots.svg` (a separate overlay, not in the art layers
  themselves). `<name>` must match an entry's `id` in `js/regions-config.js`.
- When adding a layer: update `js/layers-config.js` + add a matching boolean
  property in `project.json` (`general.properties`).
- Commit small, focused changes (e.g. one layer's art per commit) so progress
  is easy to review/resume from another device.

## Quick start for a new session

1. `cd anatomy-wallpaper`
2. Read `README.md` for structure/usage, this file for plan/status
3. Pick the next unchecked item in the roadmap above
4. For local testing: serve the folder statically (`python -m http.server`)
   and open in a browser — `file://` may block `fetch()` of local SVGs in
   some browsers, but works fine inside Wallpaper Engine's CEF runtime
