import { create } from "zustand";

export type EnvironmentPreset = "studio" | "city" | "sunset" | "warehouse";

export interface LoadedModel {
  /** Object URL created from the dropped file; revoke when replaced. */
  url: string;
  /** Original file name, shown in the UI. */
  name: string;
}

interface ViewerState {
  model: LoadedModel | null;
  showGrid: boolean;
  autoRotate: boolean;
  environment: EnvironmentPreset;

  loadModel: (model: LoadedModel) => void;
  clearModel: () => void;
  toggleGrid: () => void;
  toggleAutoRotate: () => void;
  setEnvironment: (preset: EnvironmentPreset) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  model: null,
  showGrid: true,
  autoRotate: false,
  environment: "studio",

  loadModel: (model) =>
    set((state) => {
      if (state.model) URL.revokeObjectURL(state.model.url);
      return { model };
    }),
  clearModel: () =>
    set((state) => {
      if (state.model) URL.revokeObjectURL(state.model.url);
      return { model: null };
    }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setEnvironment: (environment) => set({ environment }),
}));
