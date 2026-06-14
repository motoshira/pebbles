import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom does not implement object URLs, which the store relies on.
let counter = 0;
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => `blob:mock/${counter++}`);
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = vi.fn();
}
