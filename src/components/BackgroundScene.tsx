import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Background3D from './Background3D';

const BackgroundScene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
    >
      <Environment preset="sunset" />
      <Background3D />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default BackgroundScene;
