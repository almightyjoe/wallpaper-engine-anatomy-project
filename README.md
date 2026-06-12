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
    ├── layers/             # One SVG per system, shared 400x800 viewBox/coordinate space
    └── preview/            # Wallpaper Engine workshop preview image(s)
```

## Current status: placeholder artwork

All `assets/layers/*.svg` files are **simplified geometric placeholders** sharing
a common `viewBox="0 0 400 800"` coordinate space so they align when stacked.
They establish the structure (groups, ids, `data-region` tags) that real artwork
should follow.

To replace with medically accurate art:

- Source candidates: [BodyParts3D / Anatomography](https://lifesciencedb.jp/bp3d/) (CC-BY-SA),
  [Wikimedia Commons – Category:Human anatomy](https://commons.wikimedia.org/wiki/Category:Anatomy)
  (mixed open licenses — check each file), [OpenStax anatomy illustrations](https://openstax.org/) (CC-BY).
- Always record the source + license per file (see `assets/layers/SOURCES.md`, create as you go).
- Keep the same `viewBox="0 0 400 800"` and the same `id="region-..."` /
  `data-region="..."` attributes on swappable groups so `main.js` and
  `regions-config.js` keep working without changes.

## Adding or changing a layer

1. Drop a new SVG into `assets/layers/`, using `viewBox="0 0 400 800"`.
2. Add an entry to `ANATOMY_LAYERS` in `js/layers-config.js` (id, file, label,
   legend color, stacking position = array position, WE property name).
3. Add a matching boolean property in `project.json` under
   `general.properties` (id must match `layer.property`).

## Adding a clickable region

1. In the relevant SVG(s), tag the group/shape with `id="region-<name>"` and
   `data-region="<name>"`.
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

To preview inside Wallpaper Engine itself:

1. Open Wallpaper Engine → **Editor** → **New Wallpaper** → **Web**.
2. Point it at this folder's `index.html`.
3. Use the **Properties** panel to confirm the layer checkboxes and sidebar
   position option work.

## Publishing

- Add a preview image/video to `assets/preview/` (Workshop requires a preview thumbnail).
- Use Wallpaper Engine's built-in **Publish to Workshop** from the editor once
  the wallpaper looks right.
- This repo can also be pushed to GitHub for version history/collaboration —
  the Workshop upload and the GitHub repo are independent of each other.
