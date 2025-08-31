import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import QRCube from './objects/QRCube';

export default function Scene() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      {/* QR Cube with dynamic text */}
      <QRCube text="https://mysmartinventory.com/product/12345" size={1.5} />

      <OrbitControls />
    </Canvas>
  );
}
