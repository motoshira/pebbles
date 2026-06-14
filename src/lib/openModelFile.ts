import { useViewerStore } from "../store/useViewerStore";

const ACCEPTED = [".glb", ".gltf"];

export function isSupportedModel(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED.some((ext) => name.endsWith(ext));
}

/**
 * Turns a user-selected File into a loaded model in the store. Returns an
 * error message when the file type is unsupported, or null on success.
 */
export function openModelFile(file: File): string | null {
  if (!isSupportedModel(file)) {
    return `Unsupported file "${file.name}". Drop a .glb or .gltf file.`;
  }
  const url = URL.createObjectURL(file);
  useViewerStore.getState().loadModel({ url, name: file.name });
  return null;
}
