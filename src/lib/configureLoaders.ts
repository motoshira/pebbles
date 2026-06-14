import { useGLTF } from "@react-three/drei";

// Self-host the Draco decoder (vendored under public/draco) instead of drei's
// default gstatic CDN path, so Draco-compressed models load with no external
// runtime dependency. Imported for its side effect from main.tsx.
useGLTF.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
