import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { type Material, Mesh, type Object3D, type Texture } from "three";
import { safeResourceUrl } from "../lib/safeResourceUrl";

interface ModelProps {
  url: string;
}

/**
 * Renders a single glTF/GLB scene. GLB is recommended because it is
 * self-contained — a plain .gltf referencing external buffers/textures will
 * not resolve through a blob: object URL.
 */
export function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url, true, true, (loader) => {
    // Forbid the model from fetching external resources (see safeResourceUrl).
    loader.manager.setURLModifier(safeResourceUrl);
  });

  // The viewer remounts Model per file (key={url}). On unmount, free GPU memory
  // and evict the drei/three cache so long review sessions don't leak.
  useEffect(() => {
    return () => {
      disposeObject(scene);
      useGLTF.clear(url);
    };
  }, [scene, url]);

  return <primitive object={scene} />;
}

function disposeObject(root: Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof Mesh) {
      obj.geometry?.dispose();
      for (const material of materialsOf(obj.material)) {
        disposeMaterial(material);
      }
    }
  });
}

function materialsOf(material: Material | Material[]): Material[] {
  return Array.isArray(material) ? material : [material];
}

function disposeMaterial(material: Material): void {
  for (const value of Object.values(material)) {
    if (isTexture(value)) value.dispose();
  }
  material.dispose();
}

function isTexture(value: unknown): value is Texture {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Texture).isTexture === true
  );
}
