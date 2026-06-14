import { Grid, OrbitControls, Stage } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { environmentFileUrl } from "../lib/environmentPresets";
import { useViewerStore } from "../store/useViewerStore";
import { Model } from "./Model";

/**
 * The WebGL canvas. `Stage` auto-centers and frames the model and provides
 * image-based lighting via the selected environment preset (loaded from a
 * same-origin HDRI vendored under public/hdri).
 */
export function Viewer() {
  const model = useViewerStore((s) => s.model);
  const showGrid = useViewerStore((s) => s.showGrid);
  const autoRotate = useViewerStore((s) => s.autoRotate);
  const environment = useViewerStore((s) => s.environment);
  const envConfig = useMemo(
    () => ({ files: environmentFileUrl(environment) }),
    [environment],
  );

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [4, 3, 6], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#16181d"]} />

      <Suspense fallback={null}>
        {model && (
          <Stage
            key={model.url}
            environment={envConfig}
            intensity={0.4}
            adjustCamera={1.1}
          >
            <Model url={model.url} />
          </Stage>
        )}
      </Suspense>

      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={0.5}
          sectionSize={2.5}
          fadeDistance={30}
          fadeStrength={1.5}
          cellColor="#2a2e37"
          sectionColor="#3a4150"
        />
      )}

      <OrbitControls makeDefault autoRotate={autoRotate} enableDamping />
    </Canvas>
  );
}
