import type { EnvironmentPreset } from "../store/useViewerStore";

// HDRI files are vendored under public/hdri (see README/CLAUDE.md) so the viewer
// has no runtime dependency on the pmndrs CDN. Filenames match the originals
// from pmndrs/drei-assets for traceability.
const PRESET_FILES: Record<EnvironmentPreset, string> = {
  studio: "studio_small_03_1k.hdr",
  city: "potsdamer_platz_1k.hdr",
  sunset: "venice_sunset_1k.hdr",
  warehouse: "empty_warehouse_01_1k.hdr",
};

/** Resolves a preset to a same-origin HDRI URL under the app base path. */
export function environmentFileUrl(preset: EnvironmentPreset): string {
  return `${import.meta.env.BASE_URL}hdri/${PRESET_FILES[preset]}`;
}
