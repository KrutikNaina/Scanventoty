import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import QRCode from "qrcode";

/** Generates a THREE.Texture from text (SKU/URL/etc.) */
export default function useQRTexture(text = "DEMO-QR", size = 512) {
  // Define min and max allowed size for the canvas
  const MIN_SIZE = 64;
  const MAX_SIZE = 2048;
  let safeSize = Number(size);
  if (isNaN(safeSize) || !isFinite(safeSize)) {
    safeSize = 512;
  } else {
    safeSize = Math.round(safeSize);
    if (safeSize < MIN_SIZE) safeSize = MIN_SIZE;
    if (safeSize > MAX_SIZE) safeSize = MAX_SIZE;
  }

  const [texture, setTexture] = useState(null);

  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = safeSize;
    c.height = safeSize;
    return c;
  }, [safeSize]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await QRCode.toCanvas(canvas, text, {
          width: safeSize,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
        });
        if (cancelled) return;
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        setTexture(tex);
      } catch (e) {
        console.error("QR generation error:", e);
      }
    })();
    return () => { cancelled = true; };
  }, [text, safeSize, canvas]);

  return texture;
}
