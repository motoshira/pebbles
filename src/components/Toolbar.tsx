import { useRef } from "react";
import { openModelFile } from "../lib/openModelFile";
import {
  type EnvironmentPreset,
  useViewerStore,
} from "../store/useViewerStore";

const ENV_PRESETS: EnvironmentPreset[] = [
  "studio",
  "city",
  "sunset",
  "warehouse",
];

export function Toolbar() {
  const fileInput = useRef<HTMLInputElement>(null);
  const model = useViewerStore((s) => s.model);
  const showGrid = useViewerStore((s) => s.showGrid);
  const autoRotate = useViewerStore((s) => s.autoRotate);
  const environment = useViewerStore((s) => s.environment);
  const toggleGrid = useViewerStore((s) => s.toggleGrid);
  const toggleAutoRotate = useViewerStore((s) => s.toggleAutoRotate);
  const setEnvironment = useViewerStore((s) => s.setEnvironment);
  const clearModel = useViewerStore((s) => s.clearModel);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 p-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-lg bg-black/40 px-4 py-2 backdrop-blur">
        <span className="font-semibold text-white">Pebbles</span>
        {model && (
          <span className="max-w-50 truncate text-sm text-white/60">
            {model.name}
          </span>
        )}
      </div>

      <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-sm text-white backdrop-blur">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
        >
          Open
        </button>
        <ToggleButton active={showGrid} onClick={toggleGrid} label="Grid" />
        <ToggleButton
          active={autoRotate}
          onClick={toggleAutoRotate}
          label="Rotate"
        />
        <select
          value={environment}
          onChange={(e) => setEnvironment(e.target.value as EnvironmentPreset)}
          className="rounded bg-white/10 px-2 py-1 capitalize hover:bg-white/20"
          aria-label="Environment preset"
        >
          {ENV_PRESETS.map((preset) => (
            <option key={preset} value={preset} className="text-black">
              {preset}
            </option>
          ))}
        </select>
        {model && (
          <button
            type="button"
            onClick={clearModel}
            className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
          >
            Clear
          </button>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept=".glb,.gltf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const error = openModelFile(file);
            if (error) window.alert(error);
          }
          e.target.value = "";
        }}
      />
    </header>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded px-3 py-1 ${
        active ? "bg-sky-500 hover:bg-sky-400" : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {label}
    </button>
  );
}
