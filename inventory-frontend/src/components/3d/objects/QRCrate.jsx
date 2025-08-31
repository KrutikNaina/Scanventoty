import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Put a QR image at: /public/qr.png (or change path below)
export default function QRCrate() {
  const mesh = useRef();
  const texture = useLoader(THREE.TextureLoader, "/qr.png"); // fallback if missing: it will log error

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.25;
    mesh.current.position.y = Math.sin(t * 1.2) * 0.08; // float a bit
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh ref={mesh} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial
          color="#0ea5e9"
          roughness={0.35}
          metalness={0.25}
          envMapIntensity={1}
        />
        {/* Add QR texture as decals on faces */}
      </mesh>

      {/* Decal-like planes for QR on two faces */}
      <QRFace position={[0, 0, 0.81]} rotation={[0, 0, 0]} texture={texture} />
      <QRFace position={[0.81, 0, 0]} rotation={[0, Math.PI / 2, 0]} texture={texture} />
    </group>
  );
}

function QRFace({ position, rotation, texture }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
