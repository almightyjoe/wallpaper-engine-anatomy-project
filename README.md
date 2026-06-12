# Interactive Human Anatomy Wallpaper

A layered, medically-informative interactive wallpaper for [Wallpaper Engine](https://www.wallpaperengine.io/).
Built as plain HTML/CSS/JS so it runs entirely from local files — no server required,
making it portable and shareable.

## Concept

The human body is rendered as a stack of SVG layers (back to front):

1. **Skeletal** — bones
2. **Organs** — heart, lungs, liver, stomach, intestines, kidneys, brain
3. **Circulatory** — arteries/veins
4. **Nervous** — brain, spinal cord, nerves
5. **Muscular** — major muscle groups
6. **Skin** — surface (visible by default)

A sidebar lets the viewer toggle each layer on/off. The same toggles are exposed
as Wallpaper Engine properties (`project.json`) so users can configure them from
the in-app customization panel.

Each layer SVG also tags body parts with `data-region="..."` (e.g. `head`, `torso`,
`heart`, `liver`). Clicking one currently opens a placeholder info panel — this is
the scaffold for the planned **zoom feature**: clicking a region will eventually
swap to a "scene" showing a close-up of that body part with its own layered
anatomy and toggles (e.g. click the torso → zoomed view of the ribcage + organs +
vessels, each independently toggleable).

## Project structure

```
anatomy-wallpaper/
├── project.json          # Wallpaper Engine config: title, tags, customizable properties
├── index.html             # Entry point
├── css/
│   └── style.css          # Layout, sidebar, region panel styling
├── js/
│   ├── layers-config.js   # Defines layer stacking order, files, labels, legend colors
│   ├── regions-config.js  # Defines clickable body regions + future "scene" hooks
│   └── main.js             # Loads layers, builds sidebar, wires clicks + WE properties
└── assets/
    ├── layers/             # One real anatomy image per system, plus hotspots.svg overlay
    │   └── SOURCES.md      # Source URL, author, license, dimensions per image
    └── preview/            # Wallpaper Engine workshop preview image(s)
```

## Current status: real art, alignment in progress

`assets/layers/*.svg` are now real, open-licensed medical illustrations (one
per system), sourced from Wikimedia Commons / Anatomography — see
`assets/layers/SOURCES.md` for exact source, author, and license per file.

They come from different projects with different aspect ratios and poses, so
they don't align perfectly yet. Each is rendered as an `<img>` with
`object-fit: contain` inside `#layer-stack` (anchored to the "muscular"
layer's 1000x1400 size), and `js/layers-config.js` has a per-layer `scale` /
`offsetY` you can tune to nudge a layer until it lines up with the others.
This calibration is the current top priority — see `PLAN.md`.

Clickable regions are handled separately: `assets/layers/hotspots.svg` is a
transparent overlay (rendered above all art layers) containing the
`data-region` shapes (head, torso, arms, legs, heart, lungs, etc.). Its
coordinates are estimates and should be rechecked once layer alignment is done.

## Adding or changing a layer

1. Drop a new image (SVG/PNG) into `assets/layers/`, and record its source +
   license in `assets/layers/SOURCES.md`.
2. Add an entry to `ANATOMY_LAYERS` in `js/layers-config.js` (id, file, label,
   legend color, WE property name, stacking position = array position, and
   starting `scale`/`offsetY` of `1`/`0`).
3. Add a matching boolean property in `project.json` under
   `general.properties` (id must match `layer.property`).
4. Toggle the new layer on/off against the others and tune `scale`/`offsetY`
   until it roughly aligns.

## Adding a clickable region

1. Add a shape with `id="region-<name>"` and `data-region="<name>"` to
   `assets/layers/hotspots.svg`, positioned over the relevant body part.
2. Add an entry to `ANATOMY_REGIONS` in `js/regions-config.js` with a label and
   description. Leave `scene: null` until a zoomed scene exists.

## Zoom feature (planned)

`regions-config.js` and `main.js#loadRegionScene()` are the seams for this:

- A "scene" will live in `scenes/<id>/` with its own SVG layers + a small config,
  reusing the same toggle/sidebar system, scoped to that body part.
- Clicking a region with a defined `scene` should swap `#layer-stack`'s contents
  for the scene's layers and show a "back to full body" control.
- This is intentionally not implemented yet — the current click handler only
  shows an info panel — so the basic full-body wallpaper can be finished and
  tested first.

## Local development / testing

Wallpaper Engine loads `index.html` as `file://`, and `main.js` uses `fetch()` to
inline each SVG (needed so individual body parts are clickable). Some browsers
block `fetch()` of local files under `file://`. For quick iteration, you can
serve the folder with any static file server (e.g. `npx serve .` or the VS Code
"Live Server" extension) — this is purely a dev convenience and is **not** part
of the shipped wallpaper, which runs fully offline inside Wallpaper Engine.

### Installing into Wallpaper Engine

Run `install.ps1` (or double-click `install.bat`) to copy this project into
Wallpaper Engine's `projects\myprojects\` folder:

```powershell
.\install.ps1
```

It auto-detects your Wallpaper Engine install (including extra Steam library
drives) and mirrors this folder into
`...\wallpaper_engine\projects\myprojects\anatomy-wallpaper` (excluding
`.git`/`.claude`/dev scripts). Re-run it after making changes to update the
installed copy. If auto-detect fails, pass the path explicitly:

```powershell
.\install.ps1 -WallpaperEngineDir "D:\SteamLibrary\steamapps\common\wallpaper_engine"
```

Then in Wallpaper Engine:

1. Open the **Editor** → **Open Project** and browse to the installed
   `project.json` (or it may already appear in your local wallpaper library).
2. Apply it as your wallpaper.
3. Open **Properties** (right-click the running wallpaper, or from the editor)
   to confirm the layer checkboxes and sidebar position option work live.

## Publishing

- Add a preview image/video to `assets/preview/` (Workshop requires a preview thumbnail).
- Use Wallpaper Engine's built-in **Publish to Workshop** from the editor once
  the wallpaper looks right.
- This repo can also be pushed to GitHub for version history/collaboration —
  the Workshop upload and the GitHub repo are independent of each other.
