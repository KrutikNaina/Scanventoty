import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import ScannerGate from "./ScannerGate";
import MovingQR from "./MovingQR";

/** Helper to expose current beam Y to children via ref */
function BeamTracker({ beamYRef, height = 3.2, speed = 1.2 }) {
  const tRef = useRef(0);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    tRef.current = (Math.sin(t * speed) * 0.5 + 0.5) * (height - 0.4) - height / 2 + 0.2;
    beamYRef.current = tRef.current;
  });
  return null;
}

export default function PortalScene() {
  const beamYRef = useRef(0);

  const labels = useMemo(
    () => [
      "INV-QR-0001",
      "SKU-BOX-42",
      "MILK-1L-2025",
      "BREAD-500G",
      "CEREAL-CHOC-700",
      "TEA-ASSAM-250",
    ],
    []
  );

  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [4.2, 2.2, 6.2], fov: 45 }}>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 8, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.95} /> {/* gray-200 */}
      </mesh>

      {/* Gate */}
      <group position={[0, 0, 0]}>
        <ScannerGate width={3} height={3.2} depth={0.18} beamSpeed={1.35} />
      </group>

      {/* Beam tracker to share beam Y with QR movers */}
      <BeamTracker beamYRef={beamYRef} height={3.2} speed={1.35} />

      {/* Multiple moving QR panels at different Y lanes */}
      {labels.map((txt, i) => {
        const laneY = [-0.6, -0.2, 0.2, 0.6][i % 4];
        return (
          <group key={txt} position={[0, laneY, 0]}>
            <MovingQR
              text={txt}
              width={1.15}
              height={1.15}
              speed={1 + (i % 3) * 0.35}
              startZ={3.8 + (i % 4) * 0.35}
              endZ={-1.8}
              beamHeight={beamYRef.current}
            />
          </group>
        );
      })}

      <ContactShadows position={[0, -1.05, 0]} opacity={0.35} scale={10} blur={1.7} far={4} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={10} enableDamping />
    </Canvas>
  );
}
