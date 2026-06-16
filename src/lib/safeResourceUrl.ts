/**
 * Restricts which resource URLs a glTF/GLB file is allowed to pull in.
 *
 * A malicious model can embed absolute `http(s)` (or other-scheme) URIs in its
 * `buffers[].uri` / `images[].uri`. three.js' GLTFLoader would `fetch` them the
 * moment the file is opened, turning "view this model" into a beacon that leaks
 * the viewer's IP / User-Agent to an attacker-controlled host. Legitimate local
 * models only reference in-document resources: the `blob:` object URL itself and
 * embedded `data:` URIs. Everything with an explicit scheme or a
 * protocol-relative `//host` form is neutralised to `about:blank` (a harmless
 * no-op fetch). Scheme-less relative paths are left untouched — they cannot
 * resolve against a `blob:` base anyway, so they are inert.
 *
 * Wire this into the loader via `loader.manager.setURLModifier`.
 */
export function safeResourceUrl(url: string): string {
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(url)) {
    return "about:blank";
  }
  return url;
}
