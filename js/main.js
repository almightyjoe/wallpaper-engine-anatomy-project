/* Anatomy wallpaper bootstrap.
 * - Loads each layer SVG inline (so we can target data-region elements for clicks/hover)
 * - Builds the sidebar layer-toggle list from ANATOMY_LAYERS
 * - Wires region clicks to the (placeholder) zoom panel via ANATOMY_REGIONS
 * - Listens for Wallpaper Engine property changes and mirrors them in the UI
 */

const layerStack = document.getElementById("layer-stack");
const toggleList = document.getElementById("layer-toggle-list");
const sidebar = document.getElementById("sidebar");

const regionPanel = document.getElementById("region-panel");
const regionPanelTitle = document.getElementById("region-panel-title");
const regionPanelBody = document.getElementById("region-panel-body");
const regionPanelSceneNote = document.getElementById("region-panel-scene-note");
const regionPanelClose = document.getElementById("region-panel-close");

const state = {
  showLabels: true
};

init();

async function init() {
  loadLayers();
  await loadHotspotOverlay();
  buildSidebar();
  wireRegionPanel();
  wireWallpaperEngineProperties();
}

/* ---------- Layer loading ---------- */

function loadLayers() {
  // Stack order = array order, so later entries render on top.
  ANATOMY_LAYERS.forEach((layer, i) => {
    const img = document.createElement("img");
    img.src = layer.file;
    img.alt = layer.label;
    img.className = "anatomy-layer-img";
    img.id = `layer-${layer.id}`;
    img.style.zIndex = String(i);
    img.style.setProperty("--layer-scale", String(layer.scale ?? 1));
    img.style.setProperty("--layer-offset-y", `${layer.offsetY ?? 0}%`);
    if (!layer.defaultVisible) {
      img.classList.add("layer-hidden");
    }

    layerStack.appendChild(img);
  });
}

/* ---------- Hotspot overlay (clickable regions) ---------- */

async function loadHotspotOverlay() {
  try {
    const response = await fetch(HOTSPOT_OVERLAY_FILE);
    const svgText = await response.text();

    const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svgEl = parsed.documentElement;

    svgEl.classList.add("anatomy-hotspot-svg");
    svgEl.id = "hotspot-overlay";
    svgEl.style.zIndex = String(ANATOMY_LAYERS.length);

    layerStack.appendChild(svgEl);
  } catch (err) {
    console.error(`Failed to load hotspot overlay from ${HOTSPOT_OVERLAY_FILE}`, err);
  }
}

/* ---------- Sidebar ---------- */

function buildSidebar() {
  ANATOMY_LAYERS.forEach(layer => {
    const li = document.createElement("li");

    const button = document.createElement("button");
    button.className = "layer-toggle";
    button.dataset.layerId = layer.id;
    button.classList.toggle("active", layer.defaultVisible);
    button.setAttribute("aria-pressed", String(layer.defaultVisible));

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = layer.legendColor;

    const labelSpan = document.createElement("span");
    labelSpan.className = "label-text";
    labelSpan.textContent = layer.label;

    button.appendChild(swatch);
    button.appendChild(labelSpan);

    button.addEventListener("click", () => toggleLayer(layer.id));

    li.appendChild(button);
    toggleList.appendChild(li);
  });
}

function toggleLayer(layerId, forceVisible) {
  const layerImg = document.getElementById(`layer-${layerId}`);
  const button = toggleList.querySelector(`button[data-layer-id="${layerId}"]`);
  if (!layerImg || !button) return;

  const isHidden = layerImg.classList.contains("layer-hidden");
  const willBeVisible = typeof forceVisible === "boolean" ? forceVisible : isHidden;

  layerImg.classList.toggle("layer-hidden", !willBeVisible);
  button.classList.toggle("active", willBeVisible);
  button.setAttribute("aria-pressed", String(willBeVisible));
}

/* ---------- Region click -> zoom panel scaffold ---------- */

function wireRegionPanel() {
  // Delegated listener: any [data-region] element inside any layer can be clicked.
  layerStack.addEventListener("click", evt => {
    const target = evt.target.closest("[data-region]");
    if (!target) return;

    const regionId = target.dataset.region;
    showRegionPanel(regionId);
  });

  regionPanelClose.addEventListener("click", () => {
    regionPanel.classList.add("hidden");
  });
}

function showRegionPanel(regionId) {
  const region = findRegion(regionId);
  if (!region) return;

  regionPanelTitle.textContent = region.label;
  regionPanelBody.textContent = region.info;
  regionPanelSceneNote.classList.toggle("hidden", !!region.scene);

  if (region.scene) {
    // Future: navigate to scenes/<region.scene>/ for a zoomed layered view
    // of just this body part, reusing the same layer-toggle system.
    loadRegionScene(region.scene);
  }

  regionPanel.classList.remove("hidden");
}

function loadRegionScene(sceneId) {
  // Placeholder hook for the zoom feature described in the project plan:
  // clicking a region (e.g. "torso") swaps the main view for a scoped scene
  // with its own SVG layers + toggle list, plus a "back to full body" button.
  console.log(`TODO: load zoomed scene "${sceneId}"`);
}

/* ---------- Wallpaper Engine integration ---------- */

function wireWallpaperEngineProperties() {
  window.wallpaperPropertyListener = {
    applyUserProperties(properties) {
      ANATOMY_LAYERS.forEach(layer => {
        const prop = properties[layer.property];
        if (prop && typeof prop.value !== "undefined") {
          const visible = prop.value === true || prop.value === "true";
          toggleLayer(layer.id, visible);
        }
      });

      if (properties.sidebarposition) {
        const position = properties.sidebarposition.value;
        sidebar.classList.toggle("sidebar-left", position === "left");
        sidebar.classList.toggle("sidebar-right", position === "right");
      }

      if (properties.showlabels) {
        state.showLabels = properties.showlabels.value === true || properties.showlabels.value === "true";
        sidebar.classList.toggle("hide-labels", !state.showLabels);
      }
    }
  };
}
