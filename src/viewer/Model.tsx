import { useGLTF } from "@react-three/drei";

interface ModelProps {
  url: string;
}

/**
 * Renders a single glTF/GLB scene. GLB is recommended because it is
 * self-contained — a plain .gltf referencing external buffers/textures will
 * not resolve through a blob: object URL.
 */
export function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
