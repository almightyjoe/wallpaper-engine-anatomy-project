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
  - 6 stacked SVG layers (placeholder geometric art), shared `viewBox="0 0 400 800"`
  - Sidebar with color-coded toggle buttons, wired to layer visibility
  - Wallpaper Engine `applyUserProperties` listener mirrors WE property panel to the UI
  - Clickable `data-region` elements open a placeholder info panel
- `js/layers-config.js` — central layer registry (order, file, label, color, WE property id)
- `js/regions-config.js` — central region registry (id, label, description, future `scene` link)
- `assets/layers/*.svg` — placeholder art for skeletal, organs, circulatory, nervous, muscular, skin

Not done / known gaps:
- All anatomy art is placeholder geometry, not medically accurate
- Region clicks only show an info panel — no actual zoom/scene swap yet
- No preview image for Workshop publishing yet (`assets/preview/` is empty)
- No automated tests; only manually verified that all files load (200 OK) via local static server

## Roadmap (priority order)

### Phase 1 — Replace placeholder art with real anatomy (highest priority)
- Source open-licensed SVG/vector anatomy art:
  - [BodyParts3D / Anatomography](https://lifesciencedb.jp/bp3d/) (CC-BY-SA)
  - [Wikimedia Commons – Category:Anatomy](https://commons.wikimedia.org/wiki/Category:Anatomy) (check per-file license)
  - [OpenStax](https://openstax.org/) illustrations (CC-BY)
- For each of the 6 layers (`assets/layers/skin.svg`, `muscular.svg`,
  `skeletal.svg`, `circulatory.svg`, `nervous.svg`, `organs.svg`):
  - Re-draw/trace to fit the shared `viewBox="0 0 400 800"` coordinate space
    (front-facing, full body, head at top, feet at bottom — see existing
    placeholders for proportions/landmarks)
  - Preserve the existing `id="region-..."` and `data-region="..."` attributes
    on swappable groups/shapes so click handling keeps working
  - Track source + license for each file in a new `assets/layers/SOURCES.md`
- Verify alignment by toggling layers on/off in sequence — bones should sit
  under organs, organs under vessels/nerves, all under muscle/skin, etc.

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
- All layer SVGs share `viewBox="0 0 400 800"` — any new layer or scene art
  must match this (or its own consistent scene-local viewBox) so stacking
  aligns.
- Region tagging convention: `id="region-<name>"` and `data-region="<name>"`
  on the SVG group/shape that should be clickable. `<name>` must match an
  entry's `id` in `js/regions-config.js`.
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
