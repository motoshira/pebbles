import { describe, expect, it } from "vitest";
import { safeResourceUrl } from "./safeResourceUrl";

describe("safeResourceUrl", () => {
  it("allows in-document resources", () => {
    expect(safeResourceUrl("blob:https://app/abc")).toBe(
      "blob:https://app/abc",
    );
    expect(safeResourceUrl("data:image/png;base64,AAAA")).toBe(
      "data:image/png;base64,AAAA",
    );
  });

  it("allows scheme-less relative paths", () => {
    expect(safeResourceUrl("textures/wheel.png")).toBe("textures/wheel.png");
    expect(safeResourceUrl("./buffer.bin")).toBe("./buffer.bin");
  });

  it("blocks external and dangerous schemes", () => {
    expect(safeResourceUrl("https://attacker.example/track.png")).toBe(
      "about:blank",
    );
    expect(safeResourceUrl("http://attacker.example/x")).toBe("about:blank");
    expect(safeResourceUrl("//attacker.example/x")).toBe("about:blank");
    expect(safeResourceUrl("file:///etc/passwd")).toBe("about:blank");
    expect(safeResourceUrl("javascript:alert(1)")).toBe("about:blank");
  });
});
