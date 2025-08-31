import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import QRCode from 'qrcode';

export default function QRCube({ text = "Hello from Smart Inventory", size = 1 }) {
  const qrTexture = useMemo(() => {
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    // Generate QR code into the canvas
    QRCode.toCanvas(canvas, text, { margin: 1, width: 512 }, (err) => {
      if (err) console.error("QR generation error:", err);
    });

    return new THREE.CanvasTexture(canvas);
  }, [text]);

  // Rotation animation
  const meshRef = React.useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial attach="material-0" map={qrTexture} />
      <meshStandardMaterial attach="material-1" map={qrTexture} />
      <meshStandardMaterial attach="material-2" map={qrTexture} />
      <meshStandardMaterial attach="material-3" map={qrTexture} />
      <meshStandardMaterial attach="material-4" map={qrTexture} />
      <meshStandardMaterial attach="material-5" map={qrTexture} />
    </mesh>
  );
}
