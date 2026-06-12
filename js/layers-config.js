// Defines every anatomical layer: stacking order (back to front), source image,
// UI label/legend color, and the Wallpaper Engine property id that controls it.
//
// Each layer is rendered as an <img> using object-fit: contain, anchored to the
// top of #layer-stack (see css/style.css). The source images come from different
// open-licensed projects (see assets/layers/SOURCES.md) and don't share a single
// coordinate system, so `scale` and `offsetY` provide a per-layer fudge factor to
// roughly line up each figure with the "muscular" anchor layer (1000x1400, the
// largest/most detailed source). These starting values are rough first-pass
// estimates -- nudge them while toggling layers until heads/feet line up.
//
// To add a new system (e.g. "lymphatic"), add an entry here, drop an image into
// assets/layers/, and add a matching checkbox property in project.json.

const ANATOMY_LAYERS = [
  {
    id: "skeletal",
    file: "assets/layers/skeletal.svg",
    label: "Skeletal System",
    legendColor: "#f2efe9",
    property: "layer_skeletal",
    defaultVisible: false,
    scale: 1.0,
    offsetY: 0
  },
  {
    id: "organs",
    file: "assets/layers/organs.svg",
    label: "Organs",
    legendColor: "#c98ec9",
    property: "layer_organs",
    defaultVisible: false,
    scale: 1.0,
    offsetY: 0
  },
  {
    id: "circulatory",
    file: "assets/layers/circulatory.svg",
    label: "Circulatory System",
    legendColor: "#c0392b",
    property: "layer_circulatory",
    defaultVisible: false,
    scale: 1.0,
    offsetY: 0
  },
  {
    id: "nervous",
    file: "assets/layers/nervous.svg",
    label: "Nervous System",
    legendColor: "#e8d44d",
    property: "layer_nervous",
    defaultVisible: false,
    scale: 1.1,
    offsetY: 0
  },
  {
    id: "muscular",
    file: "assets/layers/muscular.svg",
    label: "Muscular System",
    legendColor: "#c1605a",
    property: "layer_muscular",
    defaultVisible: false,
    scale: 1.0,
    offsetY: 0
  },
  {
    id: "skin",
    file: "assets/layers/skin.svg",
    label: "Skin / Surface",
    legendColor: "#e8b08a",
    property: "layer_skin",
    defaultVisible: true,
    scale: 1.15,
    offsetY: 0
  }
];

// Overlay providing clickable/hoverable body-region hotspots (see
// assets/layers/hotspots.svg). Rendered above all anatomy layers, always
// present regardless of which layers are toggled on.
const HOTSPOT_OVERLAY_FILE = "assets/layers/hotspots.svg";
