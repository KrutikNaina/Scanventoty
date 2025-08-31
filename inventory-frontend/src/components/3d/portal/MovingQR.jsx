import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import useQRTexture from "../utils/useQRTexture";

/**
 * A QR panel that moves along Z through the gate and "flashes" when near the beamY.
 * Props:
 *  - text: QR text
 *  - width, height: panel size
 *  - speed: movement speed along Z
 *  - loopZ: if true, it loops back after passing gate
 *  - startZ, endZ: range of travel on Z
 *  - beamHeight: pass current beam Y (to detect scan moment)
 */
export default function MovingQR({
  text = "INV-PROD-0001",
  width = 1.2,
  height = 1.2,
  speed = 1.2,
  loopZ = true,
  startZ = 3.5,
  endZ = -1.5,
  beamHeight = 0,
}) {
  const group = useRef();
  const qrTex = useQRTexture(text, 512);
  const [scanned, setScanned] = useState(false);

  const depth = 0.06;

  // Precompute travel distance
  const distance = useMemo(() => startZ - endZ, [startZ, endZ]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Move towards negative Z
    group.current.position.z -= speed * delta;

    // Simple scan detection: when panel center y is within small band around beamHeight
    const y = group.current.position.y;
    const nearBeam = Math.abs(y - beamHeight) < 0.15;

    if (nearBeam && !scanned) {
      setScanned(true);
      // auto reset flash after short delay
      setTimeout(() => setScanned(false), 250);
    }

    // Loop
    if (group.current.position.z < endZ) {
      if (loopZ) {
        group.current.position.z = startZ;
      }
    }
  });

  return (
    <group ref={group} position={[0, 0, startZ]}>
      {/* Backing plate */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width + 0.1, height + 0.1, depth]} />
        <meshStandardMaterial
          color={scanned ? "#22c55e" : "#0ea5e9"} // green flash when scanned, else sky-500
          roughness={0.4}
          metalness={0.15}
          emissive={scanned ? "#16a34a" : "#0ea5e9"}
          emissiveIntensity={scanned ? 0.6 : 0.15}
        />
      </mesh>

      {/* QR face */}
      {qrTex && (
        <mesh position={[0, 0, depth / 2 + 0.001]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={qrTex} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
