// Scaffold for the "click a region -> zoomed anatomical view" feature.
//
// Each region corresponds to a `data-region="..."` group/id inside the layer SVGs
// (see assets/layers/*.svg). When implemented, clicking a region should swap the
// main view for a "scene" that re-uses the same layer-toggle system, scoped to
// that body part (e.g. clicking "torso" -> a scene showing torso organs/bones/
// vessels with their own layer toggles and a "back to full body" control).
//
// For now, `scene` is null, so clicks just show a placeholder info panel via
// showRegionPlaceholder() in main.js. Fill in `scene` to point at a future
// scenes/<id>/ folder (its own SVGs + config) to enable real zoom views.

const ANATOMY_REGIONS = [
  {
    id: "head",
    label: "Head & Brain",
    info: "Skull, brain, cranial nerves, and major head/neck vasculature.",
    scene: null
  },
  {
    id: "torso",
    label: "Torso",
    info: "Thoracic and abdominal cavity: heart, lungs, digestive and excretory organs, ribcage, and spine.",
    scene: null
  },
  {
    id: "arms",
    label: "Arms & Hands",
    info: "Upper limb bones, musculature, and the brachial vascular/nerve bundle.",
    scene: null
  },
  {
    id: "legs",
    label: "Legs & Feet",
    info: "Lower limb bones, musculature, and the femoral vascular/nerve bundle.",
    scene: null
  },

  // Organ-level sub-regions (only meaningful once the "organs" layer is visible).
  { id: "heart", label: "Heart", info: "Four-chambered pump driving systemic and pulmonary circulation.", scene: null },
  { id: "lung-left", label: "Left Lung", info: "Two-lobed lung; site of gas exchange.", scene: null },
  { id: "lung-right", label: "Right Lung", info: "Three-lobed lung; site of gas exchange.", scene: null },
  { id: "liver", label: "Liver", info: "Metabolic processing, detoxification, bile production.", scene: null },
  { id: "stomach", label: "Stomach", info: "Mechanical and chemical breakdown of food.", scene: null },
  { id: "intestines", label: "Intestines", info: "Nutrient absorption (small intestine) and water reabsorption/waste formation (large intestine).", scene: null },
  { id: "kidney-left", label: "Left Kidney", info: "Filters blood, regulates fluid/electrolyte balance.", scene: null },
  { id: "kidney-right", label: "Right Kidney", info: "Filters blood, regulates fluid/electrolyte balance.", scene: null },
  { id: "brain", label: "Brain", info: "Central processing of the nervous system.", scene: null }
];

function findRegion(id) {
  return ANATOMY_REGIONS.find(r => r.id === id) || null;
}
