import { type DragEvent, useState } from "react";
import { Toolbar } from "./components/Toolbar";
import { openModelFile } from "./lib/openModelFile";
import { useViewerStore } from "./store/useViewerStore";
import { Viewer } from "./viewer/Viewer";

export function App() {
  const model = useViewerStore((s) => s.model);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const error = openModelFile(file);
      if (error) window.alert(error);
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the canvas area is the file drop surface; the Open button is the keyboard-accessible path.
    <div
      className="relative h-full w-full bg-[#16181d] text-white"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <Toolbar />
      <Viewer />

      {!model && !dragging && <EmptyState />}
      {dragging && <DropOverlay />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
      <p className="text-lg font-medium text-white/80">
        Drop a .glb or .gltf file to view it
      </p>
      <p className="text-sm text-white/50">
        or use the Open button in the toolbar
      </p>
    </div>
  );
}

function DropOverlay() {
  return (
    <div className="pointer-events-none absolute inset-4 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-sky-400 bg-sky-400/10">
      <p className="text-lg font-medium text-white">Release to load</p>
    </div>
  );
}
