import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import QRCode from "qrcode";

/** Generates a THREE.Texture from text (SKU/URL/etc.) */
export default function useQRTexture(text = "DEMO-QR", size = 512) {
  const [texture, setTexture] = useState(null);

  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    return c;
  }, [size]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await QRCode.toCanvas(canvas, text, {
          width: size,
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
  }, [text, size, canvas]);

  return texture;
}
