// Defines every anatomical layer: stacking order (back to front), source SVG,
// UI label/legend color, and the Wallpaper Engine property id that controls it.
// To add a new system (e.g. "lymphatic"), add an entry here, drop a same-viewBox
// SVG into assets/layers/, and add a matching checkbox property in project.json.

const ANATOMY_LAYERS = [
  {
    id: "skeletal",
    file: "assets/layers/skeletal.svg",
    label: "Skeletal System",
    legendColor: "#f2efe9",
    property: "layer_skeletal",
    defaultVisible: false
  },
  {
    id: "organs",
    file: "assets/layers/organs.svg",
    label: "Organs",
    legendColor: "#c98ec9",
    property: "layer_organs",
    defaultVisible: false
  },
  {
    id: "circulatory",
    file: "assets/layers/circulatory.svg",
    label: "Circulatory System",
    legendColor: "#c0392b",
    property: "layer_circulatory",
    defaultVisible: false
  },
  {
    id: "nervous",
    file: "assets/layers/nervous.svg",
    label: "Nervous System",
    legendColor: "#e8d44d",
    property: "layer_nervous",
    defaultVisible: false
  },
  {
    id: "muscular",
    file: "assets/layers/muscular.svg",
    label: "Muscular System",
    legendColor: "#c1605a",
    property: "layer_muscular",
    defaultVisible: false
  },
  {
    id: "skin",
    file: "assets/layers/skin.svg",
    label: "Skin / Surface",
    legendColor: "#e8b08a",
    property: "layer_skin",
    defaultVisible: true
  }
];
