import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * A scanning gate: two posts + top bar, with a sweeping beam.
 * Props:
 *  - width, height, depth: physical dimensions
 *  - beamSpeed: speed of the vertical sweep
 */
export default function ScannerGate({
  width = 3,
  height = 3.2,
  depth = 0.2,
  beamSpeed = 1.2,
}) {
  const beamRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Sweep the beam up and down
    const y = (Math.sin(t * beamSpeed) * 0.5 + 0.5) * (height - 0.4) - height / 2 + 0.2;
    if (beamRef.current) {
      beamRef.current.position.y = y;
      // subtle pulsing opacity
      const alpha = 0.25 + 0.25 * Math.abs(Math.sin(t * (beamSpeed * 1.5)));
      beamRef.current.material.opacity = alpha;
    }
  });

  const postGeo = <boxGeometry args={[0.15, height, depth]} />;
  const postMat = <meshStandardMaterial color="#1f2937" roughness={0.6} metalness={0.2} />; // slate-800

  return (
    <group>
      {/* Left post */}
      <mesh position={[-width / 2, 0, 0]} castShadow receiveShadow>
        {postGeo}
        {postMat}
      </mesh>

      {/* Right post */}
      <mesh position={[width / 2, 0, 0]} castShadow receiveShadow>
        {postGeo}
        {postMat}
      </mesh>

      {/* Top bar */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.25, 0.2, depth]} />
        <meshStandardMaterial color="#334155" roughness={0.55} metalness={0.25} /> {/* slate-700 */}
      </mesh>

      {/* Scanning beam (glowing translucent plane) */}
      <mesh ref={beamRef} position={[0, 0, 0]}>
        <planeGeometry args={[width - 0.5, depth * 4]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
