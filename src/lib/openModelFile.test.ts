import { beforeEach, describe, expect, it } from "vitest";
import { useViewerStore } from "../store/useViewerStore";
import { isSupportedModel, openModelFile } from "./openModelFile";

function makeFile(name: string): File {
  return new File(["x"], name, { type: "application/octet-stream" });
}

beforeEach(() => {
  useViewerStore.getState().clearModel();
});

describe("isSupportedModel", () => {
  it("accepts .glb and .gltf regardless of case", () => {
    expect(isSupportedModel(makeFile("part.glb"))).toBe(true);
    expect(isSupportedModel(makeFile("PART.GLTF"))).toBe(true);
  });

  it("rejects other extensions", () => {
    expect(isSupportedModel(makeFile("part.obj"))).toBe(false);
    expect(isSupportedModel(makeFile("part.stl"))).toBe(false);
  });
});

describe("openModelFile", () => {
  it("loads a supported file into the store", () => {
    const error = openModelFile(makeFile("chair.glb"));
    expect(error).toBeNull();
    expect(useViewerStore.getState().model?.name).toBe("chair.glb");
  });

  it("returns an error and does not load an unsupported file", () => {
    const error = openModelFile(makeFile("notes.txt"));
    expect(error).toMatch(/unsupported/i);
    expect(useViewerStore.getState().model).toBeNull();
  });
});
