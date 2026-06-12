# Source Reference Images for Anatomy Layers

All files downloaded to `assets/layers/raw/` for tracing/adaptation into the final
`assets/layers/*.svg` layer files. None of the existing repo files were modified.

---

## 1. skin -> skin.svg

- **Source file page:** https://commons.wikimedia.org/wiki/File:Human_outline_(M).svg
- **Direct image URL:** https://upload.wikimedia.org/wikipedia/commons/d/df/Human_outline_%28M%29.svg
- **Author:** Mliu92 (derived from the Pioneer Plaque artwork)
- **License:** CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0 International)
- **Dimensions:** 480 x 1280 px (viewBox), aspect ratio ~0.375 (very tall/narrow)
- **Notes:** Simple black silhouette outline of a standing male figure, front-facing.
  Good base "skin" silhouette but proportions/pose (arm position, stance) differ
  noticeably from the Anatomography-style figures below — will likely need
  re-scaling and possibly a pose adjustment to align with the other layers.

---

## 2. muscular -> muscular.svg

- **Source file page:** https://commons.wikimedia.org/wiki/File:Muscular_system.svg
- **Direct image URL:** https://upload.wikimedia.org/wikipedia/commons/1/13/Muscular_system.svg
- **Author:** Termininja
- **License:** CC BY-SA 3.0 (Creative Commons Attribution-ShareAlike 3.0 Unported)
- **Dimensions:** 1000 x 1400 px (viewBox 999.99995 x 1400), aspect ratio ~0.714
- **Notes:** Detailed anterior (front) full-body male muscular system illustration,
  standard medical-diagram style, arms slightly away from body, standing pose.
  This is the best-quality/most detailed of the six and a reasonable "anchor"
  proportion-wise for the other layers (head-to-feet, similar overall stance).

---

## 3. skeletal -> skeletal.svg

- **Source file page:** https://commons.wikimedia.org/wiki/File:Skeleton_diagram.svg
- **Direct image URL:** https://upload.wikimedia.org/wikipedia/commons/4/42/Skeleton_diagram.svg
- **Author:** Unknown (historical engraving); public domain reproduction
- **License:** Public Domain (PD-Art / faithful reproduction of a 2D public domain work,
  author's life + 70 years expired)
- **Dimensions:** page size 210mm x 297mm (A4 portrait), aspect ratio ~0.707
  (close to muscular.svg's 1000x1400 ratio)
- **Notes:** Classic engraving-style anterior full-body skeleton, head-to-feet,
  arms by sides. Style (line-engraving/sepia look) is visually different from the
  flat-color Anatomography/muscular-system style, but the pose/proportions and
  aspect ratio are reasonably close, so it should align as a layer with modest
  scaling. May want to recolor/simplify for visual consistency with other layers.

---

## 4. circulatory -> circulatory.svg

- **Source file page:** https://commons.wikimedia.org/wiki/File:Circulatory_System_en.svg
- **Direct image URL:** https://upload.wikimedia.org/wikipedia/commons/2/29/Circulatory_System_en.svg
- **Author:** LadyofHats (Mariana Ruiz Villarreal)
- **License:** Public Domain (released by copyright holder, no conditions)
- **Dimensions:** 550 x 830 px (viewBox 550.00148 x 829.9977), aspect ratio ~0.663
- **Notes:** Anterior full-body outline with heart, major arteries (red) and veins
  (blue) overlaid, head-to-feet, standing pose with labels (labels can be removed/
  hidden in adaptation). Proportions are fairly close to muscular/skeletal but the
  body outline is simpler/more schematic ("LadyofHats" style) than the
  Anatomography figures — minor rescaling needed for alignment.

---

## 5. nervous -> nervous.svg

- **Source file page:** https://commons.wikimedia.org/wiki/File:Nervous_system_diagram_unlabeled.svg
- **Direct image URL:** https://upload.wikimedia.org/wikipedia/commons/5/5a/Nervous_system_diagram_unlabeled.svg
- **Authors:** Medium69 and Jmarchn
- **License:** CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0 International)
- **Dimensions:** 272 x 597 px (viewBox "118.5 122.4 272 596.99999"), aspect ratio ~0.456
- **Notes:** Anterior full-body view showing brain, spinal cord, and peripheral
  nerve branches over a faint body silhouette, head-to-feet, arms slightly out.
  This is the most "mismatched" of the six — it is taller/narrower in proportion
  (aspect ~0.456 vs ~0.66-0.71 for the others) and uses a thin schematic body
  outline. Will likely need the most rescaling/repositioning to align with the
  other layers (e.g. stretch horizontally or pad/crop to match the ~0.66-0.71
  aspect ratio used by muscular/skeletal/circulatory).

---

## 6. organs -> organs.svg

- **Source file page:** https://commons.wikimedia.org/wiki/File:202403_human_anatomy_skeleton_and_organs.svg
- **Direct image URL:** https://upload.wikimedia.org/wikipedia/commons/a/a2/202403_human_anatomy_skeleton_and_organs.svg
- **Author:** Database Center for Life Science (DBCLS) — Anatomography/BodyParts3D project
- **License:** CC BY 4.0 (Creative Commons Attribution 4.0 International)
- **Dimensions:** 600 x 1000 px, aspect ratio ~0.6
- **Notes:** Anterior full-body view combining skeleton outline with major internal
  organs (digestive, respiratory, cardiovascular organs) visible inside the torso,
  head-to-feet, standing pose. From the DBCLS/Anatomography family referenced in
  the task brief — good thematic match for "organs" layer, aspect ratio (~0.6) is
  in the same ballpark as circulatory (~0.66) and muscular/skeletal (~0.71).

---

## Style-consistency summary for integration

- **Closest in style/pose/proportions to each other:** muscular.svg (1000x1400,
  ratio 0.714), skeletal.svg (A4, ratio 0.707), circulatory.svg (550x830, ratio
  0.663), and organs.svg (600x1000, ratio 0.6) — all anterior, head-to-feet,
  standing poses with arms at/near sides, aspect ratios clustered in the
  ~0.6-0.71 range. These four should align with only modest uniform
  scaling/cropping.
- **Outliers requiring extra adjustment:**
  - skin.svg (480x1280, ratio 0.375) — much taller/narrower; a silhouette
    outline rather than a medical illustration, will need significant
    rescaling (likely widen/stretch or recompose) to match the others' proportions.
  - nervous.svg (272x597, ratio 0.456) — also notably narrower/taller than the
    muscular/skeletal/circulatory/organs cluster; will need rescaling
    (horizontal stretch and/or canvas padding) to line up head and foot positions
    with the other layers.
- **Style note:** skeletal.svg is a sepia/engraving illustration while
  muscular.svg, circulatory.svg, and organs.svg use flat/colored medical-diagram
  styles; nervous.svg and skin.svg are schematic/outline styles. Some recoloring
  or opacity adjustment may help visual consistency across the toggleable layers,
  though this is a cosmetic (not alignment) concern.
